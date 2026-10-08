import { computed, defineComponent, inject, onBeforeUnmount } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import { TABS_INJECTION_KEY } from './constants';
import { getTabKey } from './helper';
import { tabProps } from './props';

const prefixCls = getPrefixCls('tabs');

export default defineComponent({
    props: tabProps,
    setup(props, ctx) {
        const {
            valueRef,
            tabsLength,
            closableRef,
            isCard,
            handleTabClick,
            handleClose,
            closeModeRef,
            setDefaultValue,
        } = inject(TABS_INJECTION_KEY);

        const mergeClosable = computed(() => {
            if (!isCard.value) {
                return;
            }
            return typeof props.closable === 'boolean'
                ? props.closable
                : closableRef.value;
        });

        // 身份标识：value 缺省时回退 name（#1024）
        const tabKey = computed(() => getTabKey(props));

        setDefaultValue(tabKey.value);

        const handleClick = () => {
            if (props.disabled) {
                return;
            }
            handleTabClick(tabKey.value);
        };

        const handleCloseClick = (event: Event) => {
            event.stopPropagation();
            // value 未配置时回退到 name（#1024：只配 name 的 tab 关闭 payload 为空）
            handleClose(tabKey.value);
        };

        tabsLength.value = tabsLength.value + 1;
        onBeforeUnmount(() => {
            tabsLength.value = tabsLength.value - 1;
        });

        return () => {
            const defaultSlot = ctx.slots.default;
            return (
                <div
                    key={tabKey.value}
                    role="tab"
                    aria-selected={valueRef.value === tabKey.value}
                    aria-disabled={props.disabled || undefined}
                    tabindex={valueRef.value === tabKey.value ? 0 : -1}
                    onClick={handleClick}
                    class={{
                        [`${prefixCls}-tab`]: true,
                        [`${prefixCls}-tab-card`]: isCard.value,
                        [`${prefixCls}-tab-active`]:
                            valueRef.value === tabKey.value,
                        [`${prefixCls}-tab-disabled`]: props.disabled,
                        hover: closeModeRef.value === 'hover',
                    }}
                >
                    <div class={`${prefixCls}-tab-label`}>
                        {defaultSlot ? defaultSlot() : props.name}
                    </div>
                    {mergeClosable.value && (
                        <div class={`${prefixCls}-tab-close`}>
                            <CloseCircleFilled onClick={handleCloseClick} />
                        </div>
                    )}
                </div>
            );
        };
    },
});
