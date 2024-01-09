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

    let isMax = false;

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

    // 拿到modal相关的高度，计算得到最大的maxHeight
    const getMaxContentHeight = () => {
        const modalStyle = window.getComputedStyle(modalRef.value);
        const paddingTop = parseFloat(modalStyle.paddingTop);
        const paddingBottom = parseFloat(modalStyle.paddingBottom);

        return (
            window.innerHeight -
            marginTop.value -
            marginBottom.value -
            modalHeaderRef.value.offsetHeight -
            modalFooterRef.value.offsetHeight -
            paddingTop -
            paddingBottom
        );
    };

    // 如果赋值了，最大高度场景modal+上下margin 等于window.innerHeight
    const maxContentHeight = computed(() => {
        // 最大高度的场景
        if (
            modalHeight.value + marginTop.value + marginBottom.value >
            window.innerHeight
        ) {
            isMax = true;
            return getMaxContentHeight();
        }
        isMax = false;
        // 其他场景不做处理
        return props.maxContentHeight;
    });

    const isHasMaxContentHeight = computed(() =>
        Boolean(props.maxContentHeight),
    );

    watch(
        () => props.maxContentHeight,
        () => {
            isMax = false;
        },
    );

    useResize(
        modalRef,
        () => {
            // 防止死循环，isMax = false 才更新 modalHeight.value
            if (!isMax) {
                modalHeight.value = modalRef.value.offsetHeight;
            }
        },
        isHasMaxContentHeight.value,
    );

    return {
        modalRef,
        modalHeaderRef,
        modalFooterRef,
        maxContentHeight,
    };
};
