import { computed, defineComponent, ref, unref, watch } from 'vue';
import { isFunction } from 'lodash-es';
import CheckOutlined from '../icon/CheckOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import Popper from '../popper/popper';
import Scrollbar from '../scrollbar/scrollbar.vue';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import { type DropdownValue, type DropdownOption as Option, dropdownProps } from './props';

const prefixCls = getPrefixCls('dropdown');

const NAVIGATE_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'] as const;
type NavigateKey = (typeof NAVIGATE_KEYS)[number];

export default defineComponent({
    name: 'FDropdown',
    props: dropdownProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, 'click', 'visibleChange', 'update:visible', 'scroll'],
    setup(props, { slots, emit }) {
        useTheme();

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
        const [visible, updateVisible] = useNormalModel(props, emit, {
            prop: 'visible',
        });

        const activeIndex = ref(-1);

        const hasIcon = computed(() =>
            props.options.some((option) => option.icon),
        );

        const getNextValidIndex = (
            current: number,
            direction: 1 | -1,
        ): number => {
            const len = props.options.length;
            let index = current + direction;
            while (index !== current) {
                if (index < 0) index = len - 1;
                if (index >= len) index = 0;
                if (!props.options[index]?.disabled) break;
                index += direction;
            }
            return index === current ? -1 : index;
        };

        const handleKeydown = (event: KeyboardEvent) => {
            if (!visible.value) return;
            const key = event.key as NavigateKey;
            if (!NAVIGATE_KEYS.includes(key)) return;
            event.preventDefault();
            if (key === 'Escape') {
                updateVisible(false);
                activeIndex.value = -1;
                return;
            }
            if (key === 'ArrowDown') {
                activeIndex.value = getNextValidIndex(
                    activeIndex.value,
                    1,
                );
                return;
            }
            if (key === 'ArrowUp') {
                activeIndex.value = getNextValidIndex(
                    activeIndex.value,
                    -1,
                );
                return;
            }
            if (key === 'Enter' && activeIndex.value >= 0) {
                const option = props.options[activeIndex.value];
                if (option && !option.disabled) {
                    handleClick(option, event as unknown as Event);
                }
            }
        };

        const handleClick = (option: Option, event: Event) => {
            event.stopPropagation();
            if (option.disabled) {
                return;
            }
            const value = option[props.valueField] as Option['value'];
            updateCurrentValue(value);
            updateVisible(false);
            emit('click', value);
        };

        watch(currentValue, () => {
            emit(CHANGE_EVENT, unref(currentValue));
        });
        watch(visible, () => {
            emit('visibleChange', visible.value);
        });

        const renderOptions = () => (
            <div
                class={`${prefixCls}-menu`}
                tabindex={0}
                onKeydown={handleKeydown as any}
            >
                <Scrollbar
                    onScroll={(event: Event) => {
                        emit('scroll', event);
                    }}
                    containerClass={[
                        `${prefixCls}-option-wrapper`,
                        hasIcon.value ? 'has-icon' : '',
                    ]}
                >
                    {props.options.map((option, index) => {
                        const value = option[props.valueField] as Option['value'];
                        const label = option[props.labelField] as Option['label'];
                        const isSelected
                            = props.showSelectedOption
                            && currentValue.value === value;
                        const optionClassList = [
                            `${prefixCls}-option`,
                            option.disabled && 'is-disabled',
                            isSelected && 'is-selected',
                            activeIndex.value === index && 'is-active',
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
            </div>
        );

        return () => (
            <Popper
                v-model={visible.value}
                trigger={props.trigger}
                placement={props.placement}
                popperClass={[`${prefixCls}-popper`, props.popperClass]}
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
