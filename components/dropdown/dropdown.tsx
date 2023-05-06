import { defineComponent, computed, watch, PropType, VNodeTypes } from 'vue';
import { isFunction } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { TRIGGER, PLACEMENT } from '../_util/constants';
import { useNormalModel } from '../_util/use/useModel';
import { useTheme } from '../_theme/useTheme';
import Popper from '../popper/popper';

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

const dropdownProps = {
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
        type: String as PropType<typeof TRIGGER[number]>,
        default: 'hover',
    },
    placement: {
        type: String as PropType<typeof PLACEMENT[number]>,
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
};

export default defineComponent({
    name: 'FDropdown',
    props: dropdownProps,
    emits: ['click', 'visibleChange', 'update:visible'],
    setup(props, { slots, emit }) {
        useTheme();
        const [visible, updateVisible] = useNormalModel(props, emit, {
            prop: 'visible',
        });
        const hasIcon = computed(() =>
            props.options.some((option) => option.icon),
        );
        const handleClick = (option: Option) => {
            if (option.disabled) return;
            const value = option[props.valueField];
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
                    const optionClassList = [
                        `${prefixCls}-option`,
                        option.disabled && 'is-disabled',
                    ].filter(Boolean);
                    const label = option[props.labelField];
                    return (
                        <div
                            class={optionClassList}
                            onClick={() => {
                                handleClick(option);
                            }}
                        >
                            <span class={`${prefixCls}-option-icon`}>
                                {option.icon?.()}
                            </span>
                            <span class={`${prefixCls}-option-label`}>
                                {isFunction(label) ? label(option) : label}
                            </span>
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
