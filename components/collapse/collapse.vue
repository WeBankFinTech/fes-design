<template>
    <div :class="rootKls" role="tablist" aria-multiselectable="true">
        <slot />
    </div>
</template>

<script lang="ts">
import { provide, defineComponent, computed } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import { collapseEmits, collapseProps } from './collapseExpose';
import { useNamespace } from './useNamespace';
import { arrowPositionKey, collapseContextKey } from './common';
import type { CollapseActiveName } from './common';

export default defineComponent({
    name: 'FCollapse',
    props: collapseProps,
    emits: collapseEmits,
    setup(props, { emit }) {
        useTheme();

        const [activeNames, setActiveNames] = useNormalModel(props, emit);

        const handleItemClick = (name: CollapseActiveName) => {
            if (props.accordion) {
                setActiveNames([activeNames.value[0] === name ? '' : name]);
            } else {
                const _activeNames = [...activeNames.value];
                const index = _activeNames.indexOf(name);

                if (index > -1) {
                    _activeNames.splice(index, 1);
                } else {
                    _activeNames.push(name);
                }
                setActiveNames(_activeNames);
            }
        };

        provide(collapseContextKey, {
            activeNames,
            handleItemClick,
        });

        const ns = useNamespace('collapse');

        const rootKls = computed(() => ns.b());

        provide(arrowPositionKey, {
            arrow: props?.arrow,
            embedded: computed(() => props?.embedded),
        });
        return {
            rootKls,
            activeNames,
            setActiveNames,
        };
    },
});
</script>
