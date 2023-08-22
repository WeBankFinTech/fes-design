import { computed, defineComponent, inject, onBeforeUnmount } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import { TABS_INJECTION_KEY } from './constants';
import { tabProps } from './helper';

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
            if (!isCard.value) return;
            return typeof props.closable === 'boolean'
                ? props.closable
                : closableRef.value;
        });

        setDefaultValue(props.value);

        function handleClick() {
            if (props.disabled) return;
            handleTabClick(props.value);
        }

        function handleCloseClick(event: Event) {
            event.stopPropagation();
            handleClose(props.value);
        }

        tabsLength.value = tabsLength.value + 1;
        onBeforeUnmount(() => {
            tabsLength.value = tabsLength.value - 1;
        });

        return () => {
            const defaultSlot = ctx.slots.default;
            return (
                <div
                    key={props.value}
                    onClick={handleClick}
                    class={{
                        [`${prefixCls}-tab`]: true,
                        [`${prefixCls}-tab-card`]: isCard.value,
                        [`${prefixCls}-tab-active`]:
                            valueRef.value === props.value,
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
