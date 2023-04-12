import { watch, onUnmounted, Ref } from 'vue';
import {
    addClass,
    getScrollBarWidth,
    getStyle,
    hasClass,
    removeClass,
} from '../dom';
import getPrefixCls from '../getPrefixCls';

const cls = getPrefixCls('popup-hidden');

/**
 * Hook that monitoring the ref value to lock or unlock the screen.
 * When the trigger became true, it assumes modal is now opened and vice versa.
 */
export default function useLockScreen(trigger: Ref<boolean>) {
    let scrollBarWidth = 0;
    let withoutHiddenClass = false;
    let bodyPaddingRight = '0';
    let computedBodyPaddingRight = 0;

    const cleanup = () => {
        removeClass(document.body, cls);
        if (withoutHiddenClass) {
            document.body.style.paddingRight = bodyPaddingRight;
        }
    };

    onUnmounted(() => {
        cleanup();
    });

    watch(trigger, (val) => {
        if (val) {
            withoutHiddenClass = !hasClass(document.body, cls);
            if (withoutHiddenClass) {
                bodyPaddingRight = document.body.style.paddingRight;
                computedBodyPaddingRight = parseInt(
                    getStyle(document.body, 'paddingRight'),
                    10,
                );
            }
            scrollBarWidth = getScrollBarWidth();
            const bodyHasOverflow =
                document.documentElement.clientHeight <
                document.body.scrollHeight;
            const bodyOverflowY = getStyle(document.body, 'overflowY');
            if (
                scrollBarWidth > 0 &&
                (bodyHasOverflow || bodyOverflowY === 'scroll') &&
                withoutHiddenClass
            ) {
                document.body.style.paddingRight = `${
                    computedBodyPaddingRight + scrollBarWidth
                }px`;
            }
            addClass(document.body, cls);
        } else {
            cleanup();
        }
    });
}
