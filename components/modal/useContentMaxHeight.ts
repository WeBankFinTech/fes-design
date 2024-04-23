import { type ComputedRef, computed, nextTick, ref } from 'vue';
import { isNumber, isString } from 'lodash-es';
import { useWindowSize } from '@vueuse/core';
import useResize from '../_util/use/useResize';
import { depx } from '../_util/utils';
import type { ModalInnerProps } from './props';

export const useContentMaxHeight = (
    styles: ComputedRef<
        | {
              width?: undefined;
              marginTop?: undefined;
              marginBottom?: undefined;
          }
          | {
              width: string;
              marginTop: string | number;
              marginBottom: string | number;
          }
    >,
    props: ModalInnerProps,
) => {
    const modalRef = ref<HTMLElement | null>(null);
    const modalHeaderRef = ref<HTMLElement | null>(null);
    const modalFooterRef = ref<HTMLElement | null>(null);
    const modalHeaderHight = ref(0);
    const modalFooterHight = ref(0);

    // 获取响应式的窗口高度
    const { height: windowHeight } = useWindowSize();

    // let isCalculate = false;

    const marginTop = computed(() => {
        return isNumber(styles.value.marginTop)
            ? styles.value.marginTop
            : Number.parseFloat(styles.value.marginTop);
    });

    const marginBottom = computed(() => {
        return isNumber(styles.value.marginBottom)
            ? styles.value.marginBottom
            : Number.parseFloat(styles.value.marginBottom);
    });

    const modalStyle = computed(() => {
        return modalRef.value && window.getComputedStyle(modalRef.value);
    });

    const paddingTop = computed(() => {
        return Number.parseFloat(modalStyle.value?.paddingTop);
    });

    const paddingBottom = computed(() => {
        return Number.parseFloat(modalStyle.value?.paddingBottom);
    });

    // 最大场景的弹窗高度
    const realMaxHeight = computed(() => {
        return windowHeight.value - marginTop.value - marginBottom.value;
    });

    // 用户设定的最大弹窗高度，支持百分比 'xxx%'字符串和固定值数字,算出来具体的px
    const currentMaxModalHeight = computed(() => {
        if (props.maxHeight) {
            if (isNumber(props.maxHeight)) {
                return props.maxHeight;
            } else if (
                isString(props.maxHeight)
                && props.maxHeight.endsWith('px')
            ) {
                // px字符串 解析字符串的数字
                return depx(props.maxHeight);
            } else if (
                isString(props.maxHeight)
                && props.maxHeight.endsWith('%')
            ) {
                // %字符串 解析字符串的数字，算出百分比对应的高度px
                return (Number.parseFloat(props.maxHeight) / 100) * windowHeight.value;
            } else {
                console.warn('[FModal] maxHeight 仅支持 px、%、数值格式');
            }
        }
        return undefined;
    });

    // 实际滚动区域的高度
    const contentMaxHeight = computed(() => {
        // 最大场景的内容高度
        const maxContentHeight
            = windowHeight.value
            - marginTop.value
            - marginBottom.value
            - modalHeaderHight.value
            - modalFooterHight.value
            - paddingTop.value
            - paddingBottom.value;

        if (maxContentHeight < 100) {
            return 100;
            // 如果最大场景的弹窗高度 小于用户设定的弹窗高度值，返回最大场景的内容高
        } else if (realMaxHeight.value <= currentMaxModalHeight.value) {
            return maxContentHeight;
        } else {
            return (
                currentMaxModalHeight.value
                - modalHeaderHight.value
                - modalFooterHight.value
                - paddingTop.value
                - paddingBottom.value
            );
        }
    });

    const hasMaxHeight = computed(() => Boolean(currentMaxModalHeight.value));

    // 监听头部和底部的变化
    useResize(
        modalHeaderRef,
        async () => {
            await nextTick();
            modalHeaderHight.value = modalHeaderRef.value?.offsetHeight;
        },
        hasMaxHeight.value,
    );
    useResize(
        modalFooterRef,
        async () => {
            await nextTick();
            modalFooterHight.value = modalFooterRef.value?.offsetHeight;
        },
        hasMaxHeight.value,
    );

    return {
        modalRef,
        modalHeaderRef,
        modalFooterRef,
        contentMaxHeight,
        hasMaxHeight,
    };
};
