import {
    type ComponentObjectPropsOptions,
    defineComponent,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    provide,
    reactive,
    ref,
    toRefs,
} from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { SELECT_PROVIDE_KEY } from './const';

export const selectGroupOptionProps = {
    label: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type SelectGroupOptionProps = ExtractPublicPropTypes<
    typeof selectGroupOptionProps
>;

export default defineComponent({
    name: 'FSelectGroupOption',
    props: selectGroupOptionProps,
    setup(props, ctx) {
        const parent = inject(SELECT_PROVIDE_KEY, null);
        if (!parent) {
            console.warn(
                '[FSelectGroupOption]: FSelectGroupOption 必须搭配 FSelect 组件使用！',
            );
        }

        const instance = getCurrentInstance();

        const { addOption, removeOption, parentGroupOption } = parent;

        const selectGroupOption = reactive({
            id: instance.uid,
            ...toRefs(props),
            slots: ctx.slots,
            children: [], // 若 children 为数组类型，则自动判断 __isGroup 为 true
        });

        const selectGroupOptionRef = ref<HTMLElement>();

        provide(SELECT_PROVIDE_KEY, {
            addOption,
            removeOption,
            parentGroupOption: selectGroupOption,
        });

        onBeforeMount(() => {
            addOption(selectGroupOption, parentGroupOption);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid, parentGroupOption);
        });

        return () => {
            return (
                <span ref={selectGroupOptionRef}>{ctx.slots.default?.()}</span>
            );
        };
    },
});
