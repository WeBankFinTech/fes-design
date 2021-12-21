import { computed, defineComponent, nextTick, provide, ref, toRef, TransitionGroup, vShow, watch, withDirectives } from 'vue';
import { CLOSE_EVENT, TABS_INJECTION_KEY, UPDATE_MODEL_EVENT } from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import useScrollX from '../_util/use/useScrollX';
import { flatten } from '../_util/vnode';
import { computeTabBarStyle } from './helper';
import Tab from './tab';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('tabs');

function mapTabPane(tabPaneVNodes = [], tabValue) {
    const children = [];
    tabPaneVNodes.forEach((vNode) => {
        const { value, 'display-directive': _displayDirective, displayDirective } = vNode.props;
        if (!vNode.key) vNode.key = value;
        if (!vNode.props.key) vNode.props.key = value;
        const show = value === tabValue;
        const useVShow = displayDirective === 'show' || _displayDirective === 'show';
        if (useVShow) {
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (show) {
            children.push(vNode);
        }
    });
    return children;
}

export default defineComponent({
    name: 'FTabs',
    components: { Tab, TransitionGroup },
    props: {
        modelValue: [String, Number],
        position: {
            type: String,
            default: 'top',
            validator(value) {
                return ['top', 'right', 'bottom', 'left'].includes(value);
            },
        },
        type: {
            type: String,
            default: 'line',
            validator(value) {
                return ['line', 'card'].includes(value);
            },
        },
        closable: {
            type: Boolean,
            default: false,
        },
    },
    emits: [UPDATE_MODEL_EVENT, CLOSE_EVENT],
    setup(props, ctx) {
        useTheme();
        const tabRefs = ref([]);
        const [currentValue, updateCurrentValue] = useNormalModel(props, ctx.emit);
        const isCard = computed(() => props.type === 'card');

        const showFirstScrollBar = ref(false);
        const showLastScrollBar = ref(false);
        const tabNavRef = ref(null);
        useScrollX(tabNavRef);
        const barStyle = ref({});

        function setTabRefs(el, index) {
            if (el) tabRefs.value[index] = el;
        }

        function handleTabClick(key) {
            updateCurrentValue(key);
        }

        function handleClose(key) {
            ctx.emit(CLOSE_EVENT, key);
        }

        function autoScrollTab(el) {
            if (!tabNavRef.value || !el) return;
            const { scrollLeft, scrollTop, offsetWidth, offsetHeight } = tabNavRef.value;
            if (scrollLeft + offsetWidth < el.offsetLeft + el.offsetWidth || el.offsetLeft < scrollLeft) {
                tabNavRef.value.scrollTo({ left: el.offsetLeft - offsetWidth + el.offsetWidth });
            } else if (scrollTop + offsetHeight < el.offsetTop + el.offsetHeight || el.offsetTop < scrollTop) {
                tabNavRef.value.scrollTo({ top: el.offsetTop - offsetHeight + el.offsetHeight });
            }
        }

        provide(TABS_INJECTION_KEY, {
            valueRef: currentValue,
            closableRef: toRef(props, 'closable'),
            isCard,
            handleTabClick,
            handleClose,
        });

        watch(
            () => [currentValue.value, props.position],
            () => {
                nextTick(() => {
                    const tab = tabRefs.value.find((item) => item.value === currentValue.value);
                    if (!isCard.value) {
                        barStyle.value = computeTabBarStyle(tab?.$el, props.position);
                    }
                    autoScrollTab(tab?.$el);
                });
            },
            { immediate: true },
        );

        function handleTabNavScroll() {
            if (!tabNavRef.value) return;
            const { scrollWidth, scrollHeight, scrollLeft, scrollTop, offsetWidth, offsetHeight } = tabNavRef.value;

            showFirstScrollBar.value = scrollLeft > 0 || scrollTop > 0;
            showLastScrollBar.value = scrollLeft + offsetWidth < scrollWidth || scrollTop + offsetHeight < scrollHeight;
        }

        const scrollBarCls = computed(() => {
            const cls = { start: '', end: '' };
            if (props.position === 'top' || props.position === 'bottom') {
                cls.start = `${prefixCls}-scroll-x-bar ${prefixCls}-scroll-x-bar-left`;
                cls.end = `${prefixCls}-scroll-x-bar ${prefixCls}-scroll-x-bar-right`;
            } else {
                cls.start = `${prefixCls}-scroll-y-bar ${prefixCls}-scroll-y-bar-top`;
                cls.end = `${prefixCls}-scroll-y-bar ${prefixCls}-scroll-y-bar-bottom`;
            }
            return cls;
        });

        if (!currentValue.value && ctx.slots.default) {
            // set default value
            const tabPanes = flatten(ctx.slots.default()).filter((vNode) => vNode.type.name === 'FTabPane');
            updateCurrentValue(tabPanes[0]?.props?.value);
        }

        return () => {
            const children = ctx.slots.default && flatten(ctx.slots.default()).filter((vNode) => vNode.type.name === 'FTabPane');
            return (
                <div
                    class={{
                        [`${prefixCls}`]: true,
                        [`${prefixCls}-${props.position}`]: true,
                        [`${prefixCls}-card`]: isCard.value,
                    }}
                >
                    <div class={`${prefixCls}-tab-wrapper`}>
                        <div class={`${prefixCls}-tab-nav`} onScroll={handleTabNavScroll} ref={tabNavRef}>
                            {children.map((vNode, index) => {
                                const tabSlot = vNode.children.tab;
                                return (
                                    <>
                                        {index > 0 && isCard.value && <div class={`${prefixCls}-tab-pad`}></div>}
                                        {tabSlot ? (
                                            <Tab {...vNode.props} ref={(el) => setTabRefs(el, index)}>
                                                {tabSlot?.()}
                                            </Tab>
                                        ) : (
                                            <Tab {...vNode.props} ref={(el) => setTabRefs(el, index)} />
                                        )}
                                    </>
                                );
                            })}
                            {!isCard.value && <div class={`${prefixCls}-bar`} style={barStyle.value}></div>}
                            {isCard.value && <div class={`${prefixCls}-tab-pad`} style="flex: 1 1 100%"></div>}
                        </div>
                        <div v-show={showFirstScrollBar.value} class={scrollBarCls.value.start}></div>
                        <div v-show={showLastScrollBar.value} class={scrollBarCls.value.end}></div>
                    </div>
                    <div class={`${prefixCls}-tab-pane-wrapper`}>
                        <TransitionGroup name={`${prefixCls}-slide-fade`}>{mapTabPane(children, currentValue.value)}</TransitionGroup>
                    </div>
                </div>
            );
        };
    },
});
