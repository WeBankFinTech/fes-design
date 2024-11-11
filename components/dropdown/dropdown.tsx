import { computed, defineComponent, ref, watch } from 'vue';
import { isFunction } from 'lodash-es';
import CheckOutlined from '../icon/CheckOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import Popper from '../popper/popper';
import Scrollbar from '../scrollbar/scrollbar.vue';
import { type DropdownOption as Option, dropdownProps } from './props';

const prefixCls = getPrefixCls('dropdown');

export default defineComponent({
    name: 'FDropdown',
    props: dropdownProps,
    emits: ['click', 'visibleChange', 'update:visible', 'scroll'],
    setup(props, { slots, emit }) {
        useTheme();

        const currentValue = ref<Option['value']>();
        const [visible, updateVisible] = useNormalModel(props, emit, {
            prop: 'visible',
        });

        const hasIcon = computed(() =>
            props.options.some((option) => option.icon),
        );

        const handleClick = (option: Option, event: Event) => {
            event.stopPropagation();
            if (option.disabled) {
                return;
            }
            const value = option[props.valueField] as Option['value'];
            currentValue.value = value;
            updateVisible(false);
            emit('click', value);
        };

        watch(visible, () => {
            emit('visibleChange', visible.value);
        });

        const renderOptions = () => (
            <Scrollbar
                onScroll={(event: Event) => {
                    emit('scroll', event);
                }}
                containerClass={[
                    `${prefixCls}-option-wrapper`,
                    hasIcon.value ? 'has-icon' : '',
                ]}
            >
                {props.options.map((option) => {
                    const value = option[props.valueField] as Option['value'];
                    const label = option[props.labelField] as Option['label'];
                    const isSelected
                        = props.showSelectedOption
                        && currentValue.value === value;
                    const optionClassList = [
                        `${prefixCls}-option`,
                        option.disabled && 'is-disabled',
                        isSelected && 'is-selected',
                    ].filter(Boolean);
                    return (
                        <div
                            class={optionClassList}
                            onClick={(event: Event) => {
                                handleClick(option, event);
                            }}
                        >
                            {option.icon && (
                                <span class={`${prefixCls}-option-icon`}>
                                    {option.icon?.()}
                                </span>
                            )}
                            <span class={`${prefixCls}-option-label`}>
                                {isFunction(label) ? label(option) : label}
                            </span>
                            {props.showSelectedOption && (
                                <span
                                    class={`${prefixCls}-option-selected-wrapper`}
                                >
                                    <CheckOutlined
                                        class={`${prefixCls}-option-selected-icon`}
                                    />
                                </span>
                            )}
                        </div>
                    );
                })}
            </Scrollbar>
        );

        return () => (
            <Popper
                v-model={visible.value}
                trigger={props.trigger}
                placement={props.placement}
                popperClass={`${prefixCls}-popper`}
                appendToContainer={props.appendToContainer}
                getContainer={props.getContainer}
                offset={props.offset}
                disabled={props.disabled}
                arrow={props.arrow}
                v-slots={{
                    default: renderOptions,
                    trigger: slots.default,
                }}
            />
        );
    },
});
