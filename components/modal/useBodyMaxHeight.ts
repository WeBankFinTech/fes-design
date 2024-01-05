import {
    ref,
    watch,
    nextTick,
    computed,
    type ComputedRef,
    type Ref,
} from 'vue';
import { isNumber } from 'lodash-es';
import { type ModalInnerProps } from './props';

type UseBodyMaxHeightProps = {
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
    >;
    visible: Ref<boolean>;
};

export const useBodyMaxHeight = (
    config: UseBodyMaxHeightProps,
    props: ModalInnerProps,
) => {
    const { visible, styles } = config;

    const modalRef = ref<HTMLElement | null>(null);
    const modalHeaderRef = ref<HTMLElement | null>(null);
    const modalFooterRef = ref<HTMLElement | null>(null);
    const modalHeight = ref(0);

    // 为了不让外部出现滚动条，最大高度场景modal+上下margin 等于window.innerHeight
    const maxHeight = computed(() => {
        const marginTop = isNumber(styles.value.marginTop)
            ? styles.value.marginTop
            : parseFloat(styles.value.marginTop);
        const marginBottom = isNumber(styles.value.marginBottom)
            ? styles.value.marginBottom
            : parseFloat(styles.value.marginBottom);

        if (modalHeight.value + marginTop + marginBottom > window.innerHeight) {
            const modalStyle = window.getComputedStyle(modalRef.value);
            const paddingTop = parseFloat(modalStyle.paddingTop);
            const paddingBottom = parseFloat(modalStyle.paddingBottom);

            // 算出该场景下的内容最大高,减去padding和头尾高度
            return (
                window.innerHeight -
                marginTop -
                marginBottom -
                modalHeaderRef.value.offsetHeight -
                modalFooterRef.value.offsetHeight -
                paddingTop -
                paddingBottom // modal的上下padding
            );
        }
        // 其他场景不做额外处理
        return props.maxHeight;
    });

    watch(
        () => visible.value,
        () => {
            nextTick().then(() => {
                if (modalRef.value) {
                    // 此处赋值会触发maxHeight 的重新计算赋值
                    modalHeight.value = modalRef.value.offsetHeight;
                }
            });
        },
    );

    return {
        modalRef,
        modalHeaderRef,
        modalFooterRef,
        maxHeight,
    };
};
