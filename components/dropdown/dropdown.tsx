import {
    defineComponent,
    computed,
    watch,
    PropType,
    VNodeTypes,
    ref,
    Ref,
} from 'vue';
import { isFunction } from 'lodash-es';
import CheckOutlined from '../icon/CheckOutlined';
import getPrefixCls from '../_util/getPrefixCls';
import { TRIGGER, PLACEMENT } from '../_util/constants';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import Popper from '../popper/popper';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('dropdown');

type Option = {
    value: string | number;
    label: string | number | ((option: Option) => VNodeTypes);
    disabled?: boolean;
    icon?: () => VNodeTypes;
    [key: string]:
        | string
        | number
        | boolean
        | ((option: Option) => VNodeTypes)
        | undefined;
};

export const dropdownProps = {
    visible: {
        type: Boolean,
        default: false,
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function,
    },
    trigger: {
        type: String as PropType<(typeof TRIGGER)[number]>,
        default: 'hover',
    },
    placement: {
        type: String as PropType<(typeof PLACEMENT)[number]>,
        default: 'bottom',
    },
    offset: {
        type: Number,
        default: 6,
    },
    options: {
        type: Array as PropType<Option[]>,
        default(): Option[] {
            return [];
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    valueField: {
        type: String,
        default: 'value',
    },
    labelField: {
        type: String,
        default: 'label',
    },
    arrow: {
        type: Boolean,
        default: false,
    },
    showSelectedOption: {
        type: Boolean,
        default: false,
    },
} as const;

export type DropdownProps = ExtractPublicPropTypes<typeof dropdownProps>;

export default defineComponent({
    name: 'FDropdown',
    props: dropdownProps,
    emits: ['click', 'visibleChange', 'update:visible'],
    setup(props, { slots, emit }) {
        useTheme();
        const currentValue: Ref<string | number> = ref();
        const [visible, updateVisible] = useNormalModel(props, emit, {
            prop: 'visible',
        });
        const hasIcon = computed(() =>
            props.options.some((option) => option.icon),
        );
        const handleClick = (option: Option, event: Event) => {
            event.stopPropagation();
            if (option.disabled) return;
            const value = option[props.valueField] as Option['value'];
            currentValue.value = value;
            updateVisible(false);
            emit('click', value);
        };
        watch(visible, () => {
            emit('visibleChange', visible.value);
        });
        const renderOptions = () => (
            <div
                class={[
                    `${prefixCls}-option-wrapper`,
                    hasIcon.value ? 'has-icon' : '',
                ]}
            >
                {props.options.map((option) => {
                    const value = option[props.valueField] as Option['value'];
                    const label = option[props.labelField] as Option['label'];
                    const isChecked =
                        props.showSelectedOption &&
                        currentValue.value === value;
                    const optionClassList = [
                        `${prefixCls}-option`,
                        option.disabled && 'is-disabled',
                        isChecked && 'is-checked',
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
                            {isChecked && (
                                <CheckOutlined
                                    class={`${prefixCls}-checked-icon`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
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
