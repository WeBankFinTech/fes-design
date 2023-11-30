import {
    defineComponent,
    inject,
    onBeforeMount,
    reactive,
    provide,
    onBeforeUnmount,
    getCurrentInstance,
    ref,
    toRefs,
} from 'vue';
import { PROVIDE_KEY } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const selectGroupOptionProps = {
    label: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
} as const;

export type SelectGroupOptionProps = ExtractPublicPropTypes<
    typeof selectGroupOptionProps
>;

export default defineComponent({
    name: 'FSelectGroupOption',
    props: selectGroupOptionProps,
    setup(props, ctx) {
        const parent = inject(PROVIDE_KEY, null);
        if (!parent) {
            console.warn(
                '[FSelectGroupOption]: FSelectGroupOption 必须搭配 FSelect 组件使用！',
            );
        }

        const instance = getCurrentInstance();

        const { addOption, removeOption } = parent;

        const selectGroupOption = reactive({
            id: instance.uid,
            ...toRefs(props),
            slots: ctx.slots,
            children: [], // 若 children 为数组类型，则自动判断 __isGroup 为 true
        });

        const selectGroupOptionRef = ref<HTMLElement>();
        provide(PROVIDE_KEY, {
            addOption,
            removeOption,
            selectGroupOption,
        });

        onBeforeMount(() => {
            addOption(selectGroupOption);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid);
        });

        return () => {
            return (
                <span ref={selectGroupOptionRef}>{ctx.slots.default?.()}</span>
            );
        };
    },
});
