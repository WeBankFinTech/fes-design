import { ref, Ref, watch } from 'vue';
import { isBoolean, isFunction } from 'lodash-es';
import type { PopperProps } from './props';
import type { VirtualRect } from './interface';

const triggerEventsMap = {
    click: ['onClick'],
    hover: ['onMouseenter', 'onMouseleave'],
    focus: ['onFocus', 'onBlur'],
    contextmenu: ['onContextmenu', 'onClick'],
};

type TriggerEventsMapKey = keyof typeof triggerEventsMap;

export default function useTrigger(
    visible: Ref<boolean>,
    updateVisible: (val: boolean) => void,
    props: PopperProps,
    updateVirtualRect: (val: VirtualRect | null) => void,
) {
    let triggerFocused = false;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    const events: Ref<Record<string, (e: MouseEvent) => void>> = ref({});

    function clearTimers() {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
    }

    const hide = () => {
        if (isBoolean(props.disabled) && props.disabled) return;
        if (isFunction(props.disabled) && props.disabled()) return;
        clearTimers();
        if (props.hideAfter) {
            hideTimer = setTimeout(() => {
                updateVisible(false);
            }, props.hideAfter);
        } else {
            updateVisible(false);
        }
    };

    const show = () => {
        if (isBoolean(props.disabled) && props.disabled) return;
        if (isFunction(props.disabled) && props.disabled()) return;
        clearTimers();
        if (props.showAfter) {
            showTimer = setTimeout(() => {
                updateVisible(true);
            }, props.showAfter);
        } else {
            updateVisible(true);
        }
    };

    const toggleState = () => {
        if (visible.value && !props.onlyShowTrigger) {
            hide();
        } else {
            show();
        }
    };

    const popperEventsHandler = (e: MouseEvent, t: TriggerEventsMapKey) => {
        // 不是用户触发的行为
        e.stopPropagation();
        switch (e.type) {
            case 'click': {
                if (t === 'contextmenu') {
                    if (visible.value) {
                        updateVirtualRect(null);
                        toggleState();
                    }
                } else if (triggerFocused) {
                    // reset previous focus event
                    triggerFocused = false;
                } else {
                    toggleState();
                }
                break;
            }
            case 'mouseenter': {
                show();
                break;
            }
            case 'mouseleave': {
                hide();
                break;
            }
            case 'focus': {
                triggerFocused = true;
                show();
                break;
            }
            case 'blur': {
                triggerFocused = false;
                hide();
                break;
            }
            case 'contextmenu': {
                updateVirtualRect({
                    x: e.clientX,
                    y: e.clientY,
                });
                e.preventDefault();
                show();
                break;
            }
            default:
        }
    };

    const mapEvents = (t: TriggerEventsMapKey) => {
        const _events: Record<string, (e: MouseEvent) => void> = {};
        triggerEventsMap[t].forEach((event: string) => {
            _events[event] = (e: MouseEvent) => {
                popperEventsHandler(e, t);
            };
        });
        events.value = _events;
    };

    watch(
        () => props.trigger,
        () => {
            if (props.trigger) {
                mapEvents(props.trigger);
            }
        },
        {
            immediate: true,
        },
    );

    function onPopperMouseEnter() {
        // if trigger is click, user won't be able to close popper when
        // user tries to move the mouse over popper contents
        if (props.trigger !== 'click') {
            clearTimeout(hideTimer);
        }
    }

    function onPopperMouseLeave() {
        const { trigger } = props;
        const shouldPrevent =
            trigger === 'click' ||
            trigger === 'focus' ||
            trigger === 'contextmenu';
        if (shouldPrevent) return;
        hide();
    }

    return {
        events,
        onPopperMouseEnter,
        onPopperMouseLeave,
    };
}
