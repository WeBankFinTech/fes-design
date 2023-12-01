<template>
    <div :class="rootKls" role="tablist" aria-multiselectable="true">
        <slot />
    </div>
</template>

<script lang="ts">
import { provide, defineComponent, computed, watch } from 'vue';
import { isNil } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { UseNormalModelReturn, useNormalModel } from '../_util/use/useModel';
import { collapseEmits, collapseProps } from './collapseExpose';
import { useNamespace } from './useNamespace';
import { COMPONENT_NAME, arrowPositionKey, collapseContextKey } from './common';
import type { CollapseActiveName } from './common';

export default defineComponent({
    name: COMPONENT_NAME,
    props: collapseProps,
    emits: collapseEmits,
    setup(props, { emit }) {
        useTheme();

        const [modelValue, setModelValue]: UseNormalModelReturn<
            typeof props,
            'modelValue'
        > = useNormalModel(props, emit);

        const activeNames = computed<(string | number)[]>({
            get: () => {
                if (isNil(modelValue.value)) return [];

                if (props.accordion) {
                    if (Array.isArray(modelValue.value)) {
                        console.warn(
                            `${COMPONENT_NAME}: 手风琴模式下 modelValue 不支持数组`,
                        );
                        return [];
                    }

                    return [modelValue.value];
                } else {
                    if (!Array.isArray(modelValue.value)) {
                        console.warn(
                            `${COMPONENT_NAME}: 非手风琴模式下 modelValue 仅支持数组`,
                        );
                        return [];
                    }

                    return modelValue.value;
                }
            },
            set: (names) => {
                if (props.accordion) {
                    setModelValue(names[0]);
                } else {
                    setModelValue(names);
                }
            },
        });

        // 手风琴模式变化时，重置 modelValue
        watch(
            () => props.accordion,
            () => {
                activeNames.value = [];
            },
        );

        const handleItemClick = (name: CollapseActiveName) => {
            let _activeNames = [...activeNames.value];
            const index = _activeNames.indexOf(name);

            if (props.accordion) {
                _activeNames = index > -1 ? [] : [name];
            } else {
                if (index > -1) {
                    _activeNames.splice(index, 1);
                } else {
                    _activeNames.push(name);
                }
            }

            activeNames.value = _activeNames;
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
        };
    },
});
</script>
