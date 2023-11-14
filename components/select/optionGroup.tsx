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
import { key } from './const';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const optionGroupProps = {
    label: {
        type: String,
        default: '',
    },
} as const;

export type OptionGroupProps = ExtractPublicPropTypes<typeof optionGroupProps>;

export default defineComponent({
    name: 'FOptionGroup',
    props: optionGroupProps,
    setup(props, ctx) {
        const parent = inject(key, null);
        if (!parent) {
            console.warn(
                '[FOptionGroup]: FOptionGroup 必须搭配 FSelect 组件使用！',
            );
        }

        const instance = getCurrentInstance();

        const { addOption, removeOption } = parent;

        const optionGroup = reactive({
            id: instance.uid,
            label: props.label,
            options: [],
            slots: null,
        });

        const optionGroupRef = ref<HTMLElement>();
        provide('optionGroup', optionGroup);

        onBeforeMount(() => {
            if (ctx.slots.label) {
                optionGroup.slots = ctx.slots.label();
            }
            addOption(optionGroup);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid);
        });

        return () => {
            return (
                <div ref={optionGroupRef}>
                    <div>{ctx.slots.default?.()}</div>
                </div>
            );
        };
    },
});
