<script>
import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    toRefs,
} from 'vue';
import { isArray, isString } from 'lodash-es';
import { key } from './const';
import { getOptionId } from './helper';

export default {
    name: 'FOption',
    props: {
        value: {
            type: [String, Number, Boolean, Object],
            required: true,
        },
        label: {
            type: String,
            default: null,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, ctx) {
        const parent = inject(key, null);
        if (!parent) {
            return console.error(
                '[FOption]: FOption 必须搭配 FSelect 组件使用！',
            );
        }
        const instance = getCurrentInstance();
        const optionId = getOptionId();
        instance.optionId = optionId;
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
                id: optionId,
                ...toRefs(props),
                ctx,
            };
            option.label = computed(() => label || props.label);
            addOption(option);
        });

        onBeforeUnmount(() => {
            removeOption(optionId);
        });

        return () => null;
    },
};
</script>
