import { ref, computed, watch, type ComputedRef } from 'vue';
import { isNumber } from 'lodash-es';
import useResize from '../_util/use/useResize';
import { type ModalInnerProps } from './props';

export const useBodyMaxHeight = (
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
    const modalHeight = ref(0);
    const modalHeaderHight = ref(0);
    const modalFooterHight = ref(0);

    let needScrollbar = false;

    const marginTop = computed(() => {
        return isNumber(styles.value.marginTop)
            ? styles.value.marginTop
            : parseFloat(styles.value.marginTop);
    });

    const marginBottom = computed(() => {
        return isNumber(styles.value.marginBottom)
            ? styles.value.marginBottom
            : parseFloat(styles.value.marginBottom);
    });

    const modalStyle = computed(() => {
        return modalRef.value && window.getComputedStyle(modalRef.value);
    });

    const paddingTop = computed(() => {
        return parseFloat(modalStyle.value?.paddingTop);
    });

    const paddingBottom = computed(() => {
        return parseFloat(modalStyle.value?.paddingBottom);
    });

    // 拿到modal相关的高度，计算得到最大的maxContentHeight
    const getMaxContentHeight = () => {
        return (
            window.innerHeight -
            marginTop.value -
            marginBottom.value -
            modalHeaderHight.value -
            modalFooterHight.value -
            paddingTop.value -
            paddingBottom.value
        );
    };

    // 用户设定的最大弹窗高度，支持百分比 'xxx%'字符串和固定值数字,算出来具体的px
    const setMaxHeight = computed(() => {
        if (props.maxHeight) {
            if (isNumber(props.maxHeight)) {
                return props.maxHeight;
            } else {
                // 解析字符串的数字
                return (parseFloat(props.maxHeight) / 100) * window.innerHeight;
            }
        }
        return undefined;
    });

    // 实际滚动区域的高度
    const contentMaxHeight = computed(() => {
        if (!setMaxHeight.value) {
            // 没有设置也不出现滚动条
            return undefined;
        }
        // maxHeight 大于弹窗现有高度，不出现滚动条
        if (setMaxHeight.value > modalHeight.value) {
            return undefined;
        } else {
            needScrollbar = true;
            // 边界场景，最大高度场景modal高度+上下margin 等于window.innerHeight
            if (
                setMaxHeight.value + marginTop.value + marginBottom.value >
                window.innerHeight
            ) {
                // 最大场景的内容高度
                return getMaxContentHeight();
            }
            // 计算出该滚动场景下的内容高度
            return (
                setMaxHeight.value -
                modalHeaderHight.value -
                modalFooterHight.value -
                paddingTop.value -
                paddingBottom.value
            );
        }
    });

    const isHasMaxHeight = computed(() => Boolean(props.maxHeight));

    watch(
        () => props.maxHeight,
        () => {
            needScrollbar = false;
        },
    );

    useResize(
        modalRef,
        () => {
            modalHeaderHight.value = modalHeaderRef.value?.offsetHeight;
            modalFooterHight.value = modalFooterRef.value?.offsetHeight;

            // 防止死循环，needScrollbar为false才更新 modalHeight.value
            // 出现滚动后 不再变更 modalHeight.value
            if (!needScrollbar) {
                // 弹窗实际的高度
                modalHeight.value = modalRef.value.offsetHeight;
            }
        },
        isHasMaxHeight.value,
    );

    return {
        modalRef,
        modalHeaderRef,
        modalFooterRef,
        contentMaxHeight,
    };
};
