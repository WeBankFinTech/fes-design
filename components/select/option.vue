<script setup lang="ts">
import {
    computed,
    getCurrentInstance,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    toRefs,
    useSlots,
} from 'vue';
import { isArray, isString } from 'lodash-es';
import { key } from './const';

import type { OptionProps } from './interface';

const props = withDefaults(defineProps<OptionProps>(), {
    disabled: false,
});

const slots = useSlots();

const parent = inject(key, null);
if (!parent) {
    console.warn('[FOption]: FOption 必须搭配 FSelect 组件使用！');
}
const instance = getCurrentInstance();

const { addOption, removeOption } = parent;

// 当插槽只是string时，通过slot计算label
let label = '';
if (!props.label) {
    const vNodes = slots.default();
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
        slots,
    };
    option.label = computed(() => label || props.label);
    addOption(option);
});

onBeforeUnmount(() => {
    removeOption(instance.uid);
});
</script>

<script>
export default {
    name: 'FOption',
};
</script>
