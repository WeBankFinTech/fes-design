import {
    computed,
    defineComponent,
    nextTick,
    provide,
    ref,
    toRef,
    TransitionGroup,
    watch,
    type Slots,
} from 'vue';
import {
    CLOSE_EVENT,
    CHANGE_EVENT,
    UPDATE_MODEL_EVENT,
} from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { flatten } from '../_util/vnode';
import { useTheme } from '../_theme/useTheme';
import PlusOutlined from '../icon/PlusOutlined';
import Scrollbar from '../scrollbar';
import { ADD_EVENT, COMPONENT_NAME, TABS_INJECTION_KEY } from './constants';
import { mapTabPane } from './helper';
import Tab from './tab';
import TabPane from './tab-pane.vue';
import { tabsProps } from './props';
import type { Value } from './interface';

const prefixCls = getPrefixCls('tabs');

export default defineComponent({
    name: COMPONENT_NAME,
    props: tabsProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, CLOSE_EVENT, ADD_EVENT],
    setup(props, { emit, slots }) {
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const tabPaneLazyCache: Record<string, boolean> = {};
        const tabRefs = ref<InstanceType<typeof Tab>[]>([]);
        const tabNavRef = ref<InstanceType<typeof Scrollbar> | null>(null);
        const tabsLength = ref<number>(0);

        const isCard = computed(() => props.type === 'card');
        const position = computed(() =>
            isCard.value ? 'top' : props.position,
        );

        const setTabRefs = (el?: InstanceType<typeof Tab>, index?: number) => {
            if (el) tabRefs.value[index] = el;
        };

        const handleTabClick = (key: Value) => {
            updateCurrentValue(key);
            emit(CHANGE_EVENT, key);
        };

        const handleAddClick = (event: Event) => {
            emit(ADD_EVENT, event);
        };

        const handleClose = (key: Value) => {
            emit(CLOSE_EVENT, key);
        };

        const autoScrollTab = (el?: HTMLElement) => {
            if (!tabNavRef.value || !el) return;

            const { scrollLeft, scrollTop, offsetWidth, offsetHeight } =
                tabNavRef.value.containerRef;

            if (
                ['top', 'bottom'].includes(props.position) &&
                (scrollLeft + offsetWidth < el.offsetLeft + el.offsetWidth ||
                    el.offsetLeft < scrollLeft)
            ) {
                tabNavRef.value.setScrollLeft(
                    el.offsetLeft - offsetWidth + el.offsetWidth,
                    0,
                );
            } else if (
                ['left', 'right'].includes(props.position) &&
                (scrollTop + offsetHeight < el.offsetTop + el.offsetHeight ||
                    el.offsetTop < scrollTop)
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
                        (item) => item.value === currentValue.value,
                    );
                    autoScrollTab(tab?.$el);
                });
            },
            { immediate: true },
        );

        const mergeRenderPanes = () => {
            const children =
                (slots.default &&
                    flatten(slots.default()).filter(
                        (vNode) => (vNode.type as any).name === 'FTabPane',
                    )) ||
                [];
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
                            <div class={`${prefixCls}-nav-scroll-content`}>
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
                                children,
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
