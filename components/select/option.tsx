import {
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    ref,
    toRefs,
} from 'vue';
import { SELECT_PROVIDE_KEY } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const optionProps = {
    value: {
        type: [String, Number, Boolean, Object] as PropType<
            string | number | boolean | object
        >,
        default: undefined as undefined,
    },
    label: String,
    disabled: Boolean,
} as const satisfies ComponentObjectPropsOptions;

export type OptionProps = ExtractPublicPropTypes<typeof optionProps>;

export default defineComponent({
    name: 'FOption',
    props: optionProps,
    setup(props, ctx) {
        const parent = inject(SELECT_PROVIDE_KEY, null);
        if (!parent) {
            console.warn('[FOption]: FOption 必须搭配 FSelect 组件使用！');
        }
        const instance = getCurrentInstance();

        const { addOption, removeOption, parentGroupOption } = parent;

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
            addOption(option, parentGroupOption);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid, parentGroupOption);
        });

        return () => {
            return <span ref={optionRef}>{ctx.slots.default?.()}</span>;
        };
    },
});
