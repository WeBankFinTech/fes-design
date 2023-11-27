import { defineComponent, PropType, CSSProperties } from 'vue';
import Scrollbar from '../scrollbar/scrollbar.vue';
import Ellipsis from '../ellipsis/ellipsis';
import VirtualList from '../virtual-list/virtualList';
import CheckOutlined from '../icon/CheckOutlined';
import { noop } from '../_util/utils';
import { useLocale } from '../config-provider/useLocale';
import type { SelectOption, SelectValue } from './interface';

const optionListProps = {
    prefixCls: String,
    containerStyle: {
        type: Object as PropType<CSSProperties>,
    },
    options: {
        type: Array as PropType<SelectOption[]>,
        default(): SelectOption[] {
            return [];
        },
    },
    isSelect: {
        type: Function,
        default: noop,
    },
    onSelect: {
        type: Function,
        default: noop,
    },
    onHover: {
        type: Function,
        default: noop,
    },
    isLimit: {
        type: Boolean,
    },
    emptyText: String,
    renderOption: Function,
    renderEmpty: Function,
    hoverOptionValue: [String, Number, Object] as PropType<SelectValue>,
} as const;

export default defineComponent({
    props: optionListProps,
    emits: ['scroll'],
    setup(props, { emit }) {
        const { t } = useLocale();

        const renderLabel = (
            option: SelectOption,
            isSelected: boolean,
            prefixCls: string,
        ) => {
            if ((option as any).slots?.default) {
                return (option as any).slots.default({ ...option, isSelected });
            }
            if (props.renderOption) {
                return props.renderOption({ ...option, isSelected });
            }
            if (option.label) {
                return (
                    <>
                        <Ellipsis class={`${prefixCls}-label`}>
                            {option.label}
                            {option.__cache && (
                                <span class={`${prefixCls}-label-tip`}>
                                    - {t('select.tagOption')}
                                </span>
                            )}
                        </Ellipsis>
                        {isSelected && (
                            <CheckOutlined
                                class={`${prefixCls}-checked-icon`}
                            />
                        )}
                    </>
                );
            }
            return null;
        };

        // 渲染option分组
        const renderOptionGroup = (option: SelectOption) => {
            const prefixCls = `${props.prefixCls}-option-group`;
            return (
                <div>
                    <div class={`${prefixCls}-label`}>
                        {option.slots ?? option.label}
                    </div>
                    <div class={`${prefixCls}-container`}>
                        {/* 格式缩进，渲染子选项 */}
                        {option.options.map((opt) => renderOption(opt))}
                    </div>
                </div>
            );
        };

        // 渲染每个option
        const renderOption = (option: SelectOption) => {
            // 有options说明是有选项分组的
            if (option.options) {
                // 如果组disabled,则子选项全部disable
                if (option.disabled) {
                    option.options = option.options.map((item) => {
                        return { ...item, disabled: true };
                    });
                }
                return renderOptionGroup(option);
            }

            const value = option.value;
            const isSelected = props.isSelect(value);
            const isHover = props.hoverOptionValue === option.value;
            const prefixCls = `${props.prefixCls}-option`;
            const classList = [
                prefixCls,
                isSelected && 'is-checked',
                isHover && 'is-hover',
                (option.disabled || (!isSelected && props.isLimit)) &&
                    'is-disabled',
            ].filter(Boolean);
            return (
                <div
                    class={classList}
                    onClick={() => {
                        if (option.disabled) {
                            return;
                        }
                        props.onSelect(value, option);
                    }}
                    onMouseover={() => {
                        if (option.disabled) {
                            return;
                        }
                        props.onHover(option);
                    }}
                >
                    {renderLabel(option, isSelected, prefixCls)}
                </div>
            );
        };

        const renderDefault = ({ source }: { source: SelectOption }) =>
            renderOption(source);

        return () =>
            props.options.length > 50 ? (
                <VirtualList
                    onScroll={(event: Event) => {
                        emit('scroll', event);
                    }}
                    dataSources={props.options}
                    dataKey={'value'}
                    estimateSize={32}
                    keeps={14}
                    style={props.containerStyle}
                    class={`${props.prefixCls}-dropdown is-max-height`}
                    v-slots={{ default: renderDefault }}
                ></VirtualList>
            ) : props.options.length ? (
                <Scrollbar
                    onScroll={(event: Event) => {
                        emit('scroll', event);
                    }}
                    containerStyle={props.containerStyle}
                    containerClass={`${props.prefixCls}-dropdown`}
                >
                    {props.options.map((option) => renderOption(option))}
                </Scrollbar>
            ) : props.renderEmpty ? (
                <div
                    class={[`${props.prefixCls}-dropdown`]}
                    style={props.containerStyle}
                >
                    {props.renderEmpty()}
                </div>
            ) : (
                <div
                    class={[
                        `${props.prefixCls}-dropdown`,
                        `${props.prefixCls}-null`,
                    ]}
                    style={props.containerStyle}
                >
                    {props.emptyText}
                </div>
            );
    },
});
