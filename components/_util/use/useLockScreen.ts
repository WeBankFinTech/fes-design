import { type Ref, onUnmounted, watch } from 'vue';
import {
    addClass,
    getScrollBarWidth,
    getStyle,
    hasClass,
    removeClass,
} from '../dom';
import getPrefixCls from '../getPrefixCls';
import { isServer } from '../isServer';

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
        // SSR：无 document（钩子本身服务端不执行，此处为双保险）
        if (isServer) {
            return;
        }
        cleanup();
    });

    // SSR：无 document，跳过锁屏逻辑（首帧可见的弹窗由样式 v-show 控制，
    // 客户端水合后本 watch 正常接管）
    if (isServer) {
        return;
    }

    watch(trigger, (val) => {
        if (val) {
            withoutHiddenClass = !hasClass(document.body, cls);
            if (withoutHiddenClass) {
                bodyPaddingRight = document.body.style.paddingRight;
                computedBodyPaddingRight = Number.parseInt(
                    getStyle(document.body, 'paddingRight'),
                    10,
                );
            }
            scrollBarWidth = getScrollBarWidth();
            const bodyHasOverflow
                = document.documentElement.clientHeight
                < document.body.scrollHeight;
            const bodyOverflowY = getStyle(document.body, 'overflowY');
            if (
                scrollBarWidth > 0
                && (bodyHasOverflow || bodyOverflowY === 'scroll')
                && withoutHiddenClass
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
