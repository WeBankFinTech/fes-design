import {
    h,
    computed,
    defineComponent,
    nextTick,
    provide,
    ref,
    toRef,
    TransitionGroup,
    vShow,
    watch,
    withDirectives,
    onMounted,
    Fragment,
    VNode,
    ComponentPublicInstance,
} from 'vue';
import {
    CLOSE_EVENT,
    TABS_INJECTION_KEY,
    UPDATE_MODEL_EVENT,
} from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import useScrollX from '../_util/use/useScrollX';
import { flatten } from '../_util/vnode';
import { computeTabBarStyle } from './helper';
import FTab from './tab';
import { useTheme } from '../_theme/useTheme';
import PlusOutlined from '../icon/PlusOutlined';

import type { PropType } from 'vue';
import type { Position } from './interface';

const prefixCls = getPrefixCls('tabs');
const ADD_EVENT = 'add';

function mapTabPane(tabPaneVNodes: VNode[] = [], tabValue: string | number) {
    const children: VNode[] = [];
    tabPaneVNodes.forEach((vNode) => {
        const {
            value,
            'display-directive': _displayDirective,
            displayDirective,
        } = vNode.props;
        if (!vNode.key) vNode.key = value;
        if (!vNode.props.key) vNode.props.key = value;
        const show = value === tabValue;
        const useVShow =
            displayDirective === 'show' || _displayDirective === 'show';
        if (useVShow) {
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (show) {
            children.push(vNode);
        }
    });
    return children;
}

type TabType = 'line' | 'card';
type TabCloseMode = 'hover' | 'visible';

export default defineComponent({
    name: 'FTabs',
    props: {
        modelValue: [String, Number] as PropType<string | number>,
        position: {
            type: String as PropType<Position>,
            default: 'top',
        },
        type: {
            type: String as PropType<TabType>,
            default: 'line',
        },
        closable: {
            type: Boolean,
            default: false,
        },
        closeMode: {
            type: String as PropType<TabCloseMode>,
            default: 'visible',
        },
        addable: {
            type: Boolean,
            default: false,
        },
        transition: {
            type: [String, Boolean],
            default: true,
        },
    },
    emits: [UPDATE_MODEL_EVENT, CLOSE_EVENT, ADD_EVENT],
    setup(props, ctx) {
        useTheme();
        const tabRefs = ref([]);
        const isScroll = ref(false);
        const [currentValue, updateCurrentValue] = useNormalModel(
            props,
            ctx.emit,
        );
        const isCard = computed(() => props.type === 'card');
        const position = computed(() =>
            isCard.value ? 'top' : props.position,
        );

        const showBeforeScrollBar = ref(false);
        const showAfterScrollBar = ref(false);
        const tabNavRef = ref(null);

        onMounted(() => {
            if (!tabNavRef.value) return;
            const { scrollWidth, offsetWidth, scrollHeight, offsetHeight } =
                tabNavRef.value;
            if (scrollWidth > offsetWidth || scrollHeight > offsetHeight) {
                isScroll.value = true;
                useScrollX(tabNavRef);
            }
        });

        const barStyle = ref({});

        function setTabRefs(el?: ComponentPublicInstance, index?: number) {
            if (el) tabRefs.value[index] = el;
        }

        function handleTabClick(key: string | number) {
            updateCurrentValue(key);
        }

        function handleAddClick(event: Event) {
            ctx.emit(ADD_EVENT, event);
        }

        function handleClose(key: string | number) {
            ctx.emit(CLOSE_EVENT, key);
        }

        function handleTabNavScroll(event?: Event) {
            event?.preventDefault();
            if (!tabNavRef.value) return;
            if (!isScroll.value) return;
            const {
                scrollWidth,
                scrollHeight,
                scrollLeft,
                scrollTop,
                offsetWidth,
                offsetHeight,
            } = tabNavRef.value;

            showBeforeScrollBar.value = scrollLeft > 0 || scrollTop > 0;
            showAfterScrollBar.value =
                scrollLeft + offsetWidth < scrollWidth ||
                scrollTop + offsetHeight < scrollHeight;
        }

        function autoScrollTab(el?: HTMLElement) {
            if (!tabNavRef.value || !el) return;
            if (!isScroll.value) return;
            const { scrollLeft, scrollTop, offsetWidth, offsetHeight } =
                tabNavRef.value;
            if (
                scrollLeft + offsetWidth < el.offsetLeft + el.offsetWidth ||
                el.offsetLeft < scrollLeft
            ) {
                tabNavRef.value.scrollTo({
                    left: el.offsetLeft - offsetWidth + el.offsetWidth,
                });
            } else if (
                scrollTop + offsetHeight < el.offsetTop + el.offsetHeight ||
                el.offsetTop < scrollTop
            ) {
                tabNavRef.value.scrollTo({
                    top: el.offsetTop - offsetHeight + el.offsetHeight,
                });
            }
            handleTabNavScroll();
        }

        provide(TABS_INJECTION_KEY, {
            valueRef: currentValue,
            closableRef: toRef(props, 'closable'),
            closeModeRef: toRef(props, 'closeMode'),
            isCard,
            handleTabClick,
            handleClose,
        });

        watch(
            () => [currentValue.value, position.value],
            () => {
                nextTick(() => {
                    const tab = tabRefs.value.find(
                        (item) => item.value === currentValue.value,
                    );
                    if (!isCard.value) {
                        barStyle.value = computeTabBarStyle(
                            tab?.$el,
                            position.value,
                        );
                    }
                    autoScrollTab(tab?.$el);
                });
            },
            { immediate: true },
        );

        if (!currentValue.value && ctx.slots.default) {
            // set default value
            const tabPanes = flatten(ctx.slots.default()).filter(
                (vNode) => (vNode.type as any).name === 'FTabPane',
            );
            updateCurrentValue(tabPanes[0]?.props?.value);
        }

        return () => {
            const children =
                ctx.slots.default &&
                flatten(ctx.slots.default()).filter(
                    (vNode) => (vNode.type as any).name === 'FTabPane',
                );
            return (
                <div
                    class={{
                        [`${prefixCls}`]: true,
                        [`${prefixCls}-${position.value}`]: true,
                        [`${prefixCls}-card`]: isCard.value,
                    }}
                >
                    <div class={`${prefixCls}-nav`}>
                        {ctx.slots.prefix && (
                            <div class={`${prefixCls}-nav-prefix`}>
                                {ctx.slots.prefix()}
                            </div>
                        )}
                        <div
                            class={{
                                [`${prefixCls}-nav-wrapper`]: true,
                                [`${prefixCls}-nav-wrapper--before`]:
                                    showBeforeScrollBar.value,
                                [`${prefixCls}-nav-wrapper--after`]:
                                    showAfterScrollBar.value,
                            }}
                        >
                            <div
                                class={`${prefixCls}-nav-scroll`}
                                onScroll={handleTabNavScroll}
                                ref={tabNavRef}
                            >
                                {children.map((vNode, index) => {
                                    const tabSlot = (vNode.children as any).tab;
                                    return (
                                        <>
                                            {index > 0 && isCard.value && (
                                                <div
                                                    class={`${prefixCls}-tab-pad`}
                                                ></div>
                                            )}
                                            <FTab
                                                {...(vNode.props as any)}
                                                ref={(
                                                    el: ComponentPublicInstance,
                                                ) => setTabRefs(el, index)}
                                                v-slots={{ default: tabSlot }}
                                            />
                                        </>
                                    );
                                })}
                                {!isCard.value && (
                                    <div
                                        class={`${prefixCls}-nav-bar`}
                                        style={barStyle.value}
                                    ></div>
                                )}
                            </div>
                        </div>

                        {isCard.value && props.addable && (
                            <>
                                <div class={`${prefixCls}-tab-pad`}></div>
                                <div
                                    onClick={handleAddClick}
                                    class={`${prefixCls}-tab ${prefixCls}-tab-card addable`}
                                >
                                    <PlusOutlined />
                                </div>
                            </>
                        )}

                        {ctx.slots.suffix ? (
                            <div class={`${prefixCls}-nav-suffix`}>
                                {ctx.slots.suffix()}
                            </div>
                        ) : (
                            isCard.value && (
                                <div class={`${prefixCls}-tab-pad--last`}></div>
                            )
                        )}
                    </div>
                    <div class={`${prefixCls}-tab-pane-wrapper`}>
                        <TransitionGroup
                            name={
                                props.transition
                                    ? props.transition === true
                                        ? `${prefixCls}-slide-fade`
                                        : props.transition
                                    : null
                            }
                        >
                            {mapTabPane(children, currentValue.value)}
                        </TransitionGroup>
                    </div>
                </div>
            );
        };
    },
});
