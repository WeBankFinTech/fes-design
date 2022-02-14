<script lang="ts">
import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    toRefs,
    defineComponent,
    PropType,
    ExtractPropTypes,
} from 'vue';
import { isArray, isString } from 'lodash-es';
import { key } from './const';

const optionProps = {
    value: {
        type: [String, Number, Boolean, Object] as PropType<
            string | number | boolean | object
        >,
    },
    label: String,
    disabled: Boolean,
} as const;

export type OptionProps = Partial<ExtractPropTypes<typeof optionProps>>;

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

        // 当插槽只是string时，通过slot计算label
        let label = '';
        if (!props.label) {
            const vNodes = ctx.slots.default();
            if (
                isArray(vNodes) &&
                vNodes.length === 1 &&
                isString(vNodes[0].children)
            ) {
                label = vNodes[0].children;
            }
        }

        onBeforeMount(() => {
            const option = {
                id: instance.uid,
                ...toRefs(props),
                slots: ctx.slots,
            };
            option.label = computed(() => label || props.label);
            addOption(option);
        });

        onBeforeUnmount(() => {
            removeOption(instance.uid);
        });
        return () => null;
    },
});
</script>
