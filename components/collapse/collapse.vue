<template>
    <div :class="rootKls" role="tablist" aria-multiselectable="true">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { provide } from 'vue';
import { collapseEmits, collapseProps } from './collapse';
import { useCollapse, useCollapseDOM } from './useCollapse';
import { arrowPositionKey } from './common';
import { useTheme } from '../_theme/useTheme';
console.log('usetheme: ', useTheme());
useTheme();
const props = defineProps(collapseProps);
const emit = defineEmits(collapseEmits);

const { activeNames, setActiveNames } = useCollapse(props, emit);

const { rootKls } = useCollapseDOM();

provide(arrowPositionKey, { arrow: props?.arrow });

defineExpose({
    /** @description active names */
    activeNames,
    /** @description set active names */
    setActiveNames,
});
</script>
<script lang="ts">
export default {
    name: 'FCollapse',
};
</script>
