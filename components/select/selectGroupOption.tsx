import {
    defineComponent,
    inject,
    onBeforeMount,
    reactive,
    provide,
    onBeforeUnmount,
    getCurrentInstance,
    ref,
} from 'vue';
import { key, selectGroupOptionKey } from './const';
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
        const parent = inject(key, null);
        if (!parent) {
            console.warn(
                '[FOptionGroup]: FOptionGroup 必须搭配 FSelect 组件使用！',
            );
        }

        const instance = getCurrentInstance();

        const { addOption, removeOption } = parent;

        const selectGroupOption = reactive({
            id: instance.uid,
            label: props.label,
            options: [],
            slots: null,
            disabled: props.disabled,
        });

        const selectGroupOptionRef = ref<HTMLElement>();
        provide(selectGroupOptionKey, selectGroupOption);

        onBeforeMount(() => {
            if (ctx.slots.label) {
                selectGroupOption.slots = ctx.slots.label();
            }
            addOption(selectGroupOption);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid);
        });

        return () => {
            return (
                <div ref={selectGroupOptionRef}>
                    <div>{ctx.slots.default?.()}</div>
                </div>
            );
        };
    },
});
