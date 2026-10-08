import {
    type Slots,
    TransitionGroup,
    computed,
    defineComponent,
    nextTick,
    provide,
    ref,
    toRef,
    watch,
} from 'vue';
import {
    CHANGE_EVENT,
    CLOSE_EVENT,
    UPDATE_MODEL_EVENT,
} from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { flatten } from '../_util/vnode';
import { useTheme } from '../_theme/useTheme';
import PlusOutlined from '../icon/PlusOutlined';
import Scrollbar from '../scrollbar';
import { ADD_EVENT, CLICK_TAB_EVENT, COMPONENT_NAME, TABS_INJECTION_KEY } from './constants';
import { getTabKey, mapTabPane } from './helper';
import Tab from './tab';
import TabPane from './tab-pane.vue';
import { tabsProps } from './props';
import type { Value } from './interface';

const prefixCls = getPrefixCls('tabs');

export default defineComponent({
    name: COMPONENT_NAME,
    props: tabsProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, CLOSE_EVENT, ADD_EVENT, CLICK_TAB_EVENT],
    setup(props, { emit, slots }) {
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const tabPaneLazyCache: Record<string, boolean> = {};
        const tabRefs = ref<InstanceType<typeof Tab>[]>([]);
        const tabNavRef = ref<InstanceType<typeof Scrollbar> | null>(null);
        const tabsLength = ref<number>(0);

        const isCard = computed(() => props.type === 'card');

        // #1025：closable/addable 仅在 type="card" 下生效，其余类型静默失效，此处给出提示
        if (!isCard.value && (props.closable || props.addable)) {
            console.warn(
                '[FTabs]: closable/addable 仅在 type="card" 下生效，当前 type 非 card，配置将被忽略',
            );
        }
        const position = computed(() =>
            isCard.value ? 'top' : props.position,
        );

        const setTabRefs = (el?: InstanceType<typeof Tab>, index?: number) => {
            if (el) {
                tabRefs.value[index] = el;
            }
        };

        const handleTabClick = (key: Value) => {
            if (key !== currentValue.value) {
                updateCurrentValue(key);
                emit(CHANGE_EVENT, key);
            }
            emit(CLICK_TAB_EVENT, key);
        };

        const handleAddClick = (event: Event) => {
            emit(ADD_EVENT, event);
        };

        const handleClose = (key: Value) => {
            emit(CLOSE_EVENT, key);
        };

        // 无障碍：方向键在 tab 间移动（roving tabindex），
        // 水平布局用左右键，垂直布局用上下键
        const moveTab = (step: number) => {
            const enabledTabs = tabRefs.value.filter(
                (tab) => !tab?.disabled && getTabKey(tab) !== undefined,
            );
            if (!enabledTabs.length) {
                return;
            }
            const currentIndex = enabledTabs.findIndex(
                (tab) => getTabKey(tab) === currentValue.value,
            );
            let nextIndex = currentIndex + step;
            if (nextIndex < 0) {
                nextIndex = enabledTabs.length - 1;
            }
            if (nextIndex > enabledTabs.length - 1) {
                nextIndex = 0;
            }
            const nextTab = enabledTabs[nextIndex];
            const nextKey = getTabKey(nextTab);
            if (nextKey === undefined) {
                return;
            }
            handleTabClick(nextKey);
            nextTick(() => {
                nextTab?.$el?.focus?.();
            });
        };

        const onNavKeyDown = (event: KeyboardEvent) => {
            const horizontal = ['top', 'bottom'].includes(position.value);
            // 优先用 key，仅在没有 key 时回退 code（合成事件可能只有 code）
            const key = event.key || event.code;
            let handled = false;
            let step = 0;
            if (
                (horizontal && (key === 'ArrowRight' || key === 'Right'))
                || (!horizontal && (key === 'ArrowDown' || key === 'Down'))
            ) {
                step = 1;
                handled = true;
            } else if (
                (horizontal && (key === 'ArrowLeft' || key === 'Left'))
                || (!horizontal && (key === 'ArrowUp' || key === 'Up'))
            ) {
                step = -1;
                handled = true;
            }
            if (handled) {
                event.preventDefault();
                moveTab(step);
            }
        };

        const autoScrollTab = (el?: HTMLElement) => {
            if (!tabNavRef.value || !el) {
                return;
            }

            const { scrollLeft, scrollTop, offsetWidth, offsetHeight }
                = tabNavRef.value.containerRef;

            if (
                ['top', 'bottom'].includes(props.position)
                && (scrollLeft + offsetWidth < el.offsetLeft + el.offsetWidth
                    || el.offsetLeft < scrollLeft)
            ) {
                tabNavRef.value.setScrollLeft(
                    el.offsetLeft - offsetWidth + el.offsetWidth,
                    0,
                );
            } else if (
                ['left', 'right'].includes(props.position)
                && (scrollTop + offsetHeight < el.offsetTop + el.offsetHeight
                    || el.offsetTop < scrollTop)
            ) {
                tabNavRef.value.setScrollTop(
                    el.offsetTop - offsetHeight + el.offsetHeight,
                    0,
                );
            }
        };

        // 当没有默认值时，设置第一项为默认值，在Tab组件调用
        const setDefaultValue = (value: Value) => {
            if (!currentValue.value && currentValue.value !== 0) {
                updateCurrentValue(value);
            }
        };

        provide(TABS_INJECTION_KEY, {
            valueRef: currentValue,
            closableRef: toRef(props, 'closable'),
            closeModeRef: toRef(props, 'closeMode'),
            isCard,
            tabsLength,
            handleTabClick,
            handleClose,
            setDefaultValue,
        });

        watch(
            () => [currentValue.value, position.value],
            () => {
                nextTick(() => {
                    const tab = tabRefs.value.find(
                        (item) => getTabKey(item) === currentValue.value,
                    );
                    autoScrollTab(tab?.$el);
                });
            },
            { immediate: true },
        );

        const mergeRenderPanes = () => {
            const children
                = (slots.default
                    && flatten(slots.default()).filter(
                        (vNode) => (vNode.type as any).name === 'FTabPane',
                    ))
                    || [];
            if (props.panes?.length) {
                return children.concat(
                    props.panes.map((pane) => {
                        const { render, renderTab, ...paneProps } = pane;
                        if (!render) {
                            console.warn(
                                `[${COMPONENT_NAME}]: panes 需要提供 render`,
                            );
                        }
                        const slots: Slots = {
                            default: () => render?.(paneProps),
                            tab: renderTab ? () => renderTab(paneProps) : null,
                        };
                        return (
                            <TabPane
                                {...paneProps}
                                value={paneProps.value}
                                v-slots={slots}
                            />
                        );
                    }),
                );
            }
            return children;
        };

        return () => {
            const children = mergeRenderPanes();

            let navItems = children.map((vNode, index) => {
                const tabSlot = (vNode.children as any)?.tab;
                return (
                    <Tab
                        {...(vNode.props as any)}
                        ref={(el: InstanceType<typeof Tab>) =>
                            setTabRefs(el, index)
                        }
                        v-slots={{ default: tabSlot }}
                    />
                );
            });
            if (isCard.value) {
                if (props.addable) {
                    navItems.push(
                        <div
                            onClick={handleAddClick}
                            class={`${prefixCls}-tab ${prefixCls}-tab-card addable`}
                        >
                            <PlusOutlined />
                        </div>,
                    );
                }
                // 添加 card pad
                navItems = navItems
                    .map((item, index) => [
                        item,
                        <div
                            class={
                                index !== navItems.length - 1
                                    ? `${prefixCls}-tab-pad`
                                    : `${prefixCls}-tab-pad--last`
                            }
                        />,
                    ])
                    .flat(1);
            }

            return (
                <div
                    class={{
                        [`${prefixCls}`]: true,
                        [`${prefixCls}-${position.value}`]: true,
                        [`${prefixCls}-card`]: isCard.value,
                    }}
                >
                    <div class={`${prefixCls}-nav`}>
                        {slots.prefix && (
                            <div class={`${prefixCls}-nav-prefix`}>
                                {slots.prefix()}
                            </div>
                        )}
                        <Scrollbar
                            ref={tabNavRef}
                            class={`${prefixCls}-nav-scroll`}
                            shadow={true}
                        >
                            <div
                                class={`${prefixCls}-nav-scroll-content`}
                                role="tablist"
                                onKeydown={onNavKeyDown}
                            >
                                {navItems}
                            </div>
                        </Scrollbar>
                        {slots.suffix && (
                            <div class={`${prefixCls}-nav-suffix`}>
                                {slots.suffix()}
                            </div>
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
                            {mapTabPane(
                                mergeRenderPanes(), // TODO: 待优化
                                currentValue.value,
                                tabPaneLazyCache,
                            )}
                        </TransitionGroup>
                    </div>
                </div>
            );
        };
    },
});
