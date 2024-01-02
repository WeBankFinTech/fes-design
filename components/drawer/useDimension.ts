import { type Ref, ref, watch } from 'vue';
import { isNil } from 'lodash-es';
import { depx } from '../_util/utils';
import { type DrawerInnerProps as Props } from './props';
import { COMPONENT_NAME } from './const';

// TODO: 废弃 height 和 width 以后，移除此处默认值，恢复 props 中的
const DEFAULT_DIMENSION = 520;

export const useDrawerDimension = (props: Props): Ref<number> => {
    const drawerDimension = ref<number>(DEFAULT_DIMENSION);

    watch(
        [
            () => props.dimension,
            () => props.placement,
            () => props.height,
            () => props.width,
        ],
        ([dimension, placement, height, width]) => {
            // dimension 的优先级最高
            if (!isNil(dimension)) {
                drawerDimension.value = depx(dimension);
                return;
            }
            if (!isNil(width) || !isNil(height)) {
                console.warn(
                    `[${COMPONENT_NAME}]: width 和 height 属性即将废弃，请使用 dimension 代替`,
                );

                const dimensionByPlacement = ['top', 'bottom'].includes(
                    placement,
                )
                    ? height
                    : width;
                drawerDimension.value = depx(
                    dimensionByPlacement ?? DEFAULT_DIMENSION,
                );
                return;
            }
            drawerDimension.value = DEFAULT_DIMENSION;
        },
        { immediate: true },
    );

    return drawerDimension;
};
