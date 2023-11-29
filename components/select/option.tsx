import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    toRefs,
    defineComponent,
    PropType,
    ref,
} from 'vue';
import { key, selectGroupOptionKey } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const optionProps = {
    value: {
        type: [String, Number, Boolean, Object] as PropType<
            string | number | boolean | object
        >,
    },
    label: String,
    disabled: Boolean,
} as const;

export type OptionProps = ExtractPublicPropTypes<typeof optionProps>;

export default defineComponent({
    name: 'FOption',
    props: optionProps,
    setup(props, ctx) {
        const parent = inject(key, null);
        if (!parent) {
            console.warn('[FOption]: FOption 必须搭配 FSelect 组件使用！');
        }
        const instance = getCurrentInstance();

        const { addOption, removeOption } = parent;

        // 获取是否有 SelectGroupOption 标签包裹
        const groupOption = inject(selectGroupOptionKey, null);

        const optionRef = ref<HTMLElement>();

        onBeforeMount(() => {
            const option = {
                id: instance.uid,
                ...toRefs(props),
                slots: ctx.slots,
            };
            option.label = computed(() => {
                if (props.label) {
                    return props.label;
                }
                const el = optionRef.value;
                //TODO: 检测 text 变更
                return el?.textContent || '';
            });

            // 如果是选项组包裹的，则收集包裹下面的option
            addOption(option, groupOption);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid, groupOption);
        });

        return () => {
            return <span ref={optionRef}>{ctx.slots.default?.()}</span>;
        };
    },
});
