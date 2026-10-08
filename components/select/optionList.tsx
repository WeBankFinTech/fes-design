import {
    type CSSProperties,
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    ref,
    watch,
} from 'vue';
import Scrollbar from '../scrollbar/scrollbar.vue';
import Ellipsis from '../ellipsis/ellipsis';
import VirtualList from '../virtual-list/virtualList';
import CheckOutlined from '../icon/CheckOutlined';
import { noop } from '../_util/utils';
import { useLocale } from '../config-provider/useLocale';
import TextHightlight from '../text-highlight';
import { PADDING_LEFT_BASE, PADDING_LEFT_INDENT } from './const';
import { selectProps } from './props';
import type { SelectOption, SelectValue } from './interface';

const optionListProps = {
    id: String,
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
    virtualScroll: selectProps.virtualScroll,
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
    filterText: String,
    filterTextHighlight: Boolean,
} as const satisfies ComponentObjectPropsOptions;

export default defineComponent({
    props: optionListProps,
    emits: ['scroll'],
    setup(props, { emit }) {
        const { t } = useLocale();
        const virtualListRef = ref();

        const getOptionStyle = ({ level = 1 }) => {
            return {
                paddingLeft: `${
                    PADDING_LEFT_BASE + (level - 1) * PADDING_LEFT_INDENT
                }px`,
            };
        };

        const enableVirtualScroll = computed(() => {
            if (typeof props.virtualScroll === 'boolean') {
                return props.virtualScroll ? props.options.length > 50 : false;
            }
            if (typeof props.virtualScroll === 'number') {
                return props.options.length > props.virtualScroll;
            }
            return true;
        });

        const renderLabel = (
            option: SelectOption,
            isSelected: boolean,
            prefixCls: string,
        ) => {
            if (option.__isGroup && (option as any).slots?.label) {
                return (option as any).slots.label({ ...option, isSelected });
            }
            if (!option.__isGroup && (option as any).slots?.default) {
                return (option as any).slots.default({ ...option, isSelected });
            }

            if (props.renderOption) {
                return props.renderOption({ ...option, isSelected });
            }
            if (option.label) {
                return (
                    <>
                        <Ellipsis class={`${prefixCls}-label`}>
                            {props.filterTextHighlight && props.filterText && !option.__cache
                                ? (
                                        <TextHightlight strict searchValues={[props.filterText]}>
                                            {option.label}
                                        </TextHightlight>
                                    )
                                : option.label
                            }
                            {option.__cache && (
                                <span class={`${prefixCls}-label-tip`}>
                                    - {t('select.tagOption')}
                                </span>
                            )}
                        </Ellipsis>
                        <CheckOutlined
                            class={`${prefixCls}-checked-icon ${
                                isSelected ? 'is-selected' : ''
                            }`}
                        />
                    </>
                );
            }
            return null;
        };

        // 渲染每个分组
        const renderGroupOption = (option: SelectOption) => {
            const isSelected = false;
            const prefixCls = `${props.prefixCls}-group-option`;
            const classList = [prefixCls].filter(Boolean);

            return (
                <div
                    class={classList}
                    style={getOptionStyle({ level: option.__level })}
                    role="presentation"
                >
                    {renderLabel(option, isSelected, prefixCls)}
                </div>
            );
        };

        // 渲染每个option
        const renderOption = (option: SelectOption) => {
            const value = option.value;
            const isSelected = props.isSelect(value);
            const isHover = props.hoverOptionValue === option.value;
            const prefixCls = `${props.prefixCls}-option`;
            const classList = [
                prefixCls,
                isSelected && 'is-checked',
                isHover && 'is-hover',
                (option.disabled || (!isSelected && props.isLimit))
                && 'is-disabled',
            ].filter(Boolean);

            return (
                <div
                    class={classList}
                    style={getOptionStyle({ level: option.__level })}
                    id={optionDomId(value)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled || undefined}
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
            source.__isGroup ? renderGroupOption(source) : renderOption(source);

        const inValidValueKey = '_ALL_KEY_';

        // 无障碍：listbox 容器语义，option id 与触发器 aria-activedescendant 对应
        const optionDomId = (value: SelectValue) =>
            props.id ? `${props.id}-option-${String(value)}` : undefined;

        // 高亮项变化时滚动定位（键盘上下键 / Home / End 移动高亮）：
        // 虚拟滚动用 scrollToIndex（目标可能还没渲染），
        // 普通滚动用 scrollIntoView 滚到可视区。
        // 鼠标 hover 触发时目标本身已可见，scrollIntoView 为空操作
        watch(
            () => props.hoverOptionValue,
            (value) => {
                if (value === undefined || value === null) {
                    return;
                }
                const index = props.options.findIndex(
                    (option) => option.value === value,
                );
                if (index < 0) {
                    return;
                }
                if (enableVirtualScroll.value) {
                    virtualListRef.value?.scrollToIndex?.(index);
                    return;
                }
                if (typeof document === 'undefined') {
                    return;
                }
                const id = optionDomId(value);
                if (id) {
                    document.getElementById(id)?.scrollIntoView?.({
                        block: 'nearest',
                    });
                }
            },
            { flush: 'post' },
        );

        return () =>
            enableVirtualScroll.value
                ? (
                        <VirtualList
                            ref={virtualListRef}
                            id={props.id}
                            role="listbox"
                            onScroll={(event: Event) => {
                                emit('scroll', event);
                            }}
                            dataSources={props.options}
                            dataKey={(data) =>
                            // 兼容全部选项，value为空值的选项
                                data.value === null || data.value === undefined
                                    ? inValidValueKey + String(data.value)
                                    : data.value
                            }
                            estimateSize={32}
                            keeps={14}
                            style={props.containerStyle}
                            class={`${props.prefixCls}-dropdown is-max-height`}
                            v-slots={{ default: renderDefault }}
                        ></VirtualList>
                    )
                : props.options.length
                    ? (
                            <Scrollbar
                                id={props.id}
                                role="listbox"
                                onScroll={(event: Event) => {
                                    emit('scroll', event);
                                }}
                                containerStyle={props.containerStyle}
                                containerClass={`${props.prefixCls}-dropdown`}
                            >
                                {props.options.map((option) => {
                                    return option.__isGroup
                                        ? renderGroupOption(option)
                                        : renderOption(option);
                                })}
                            </Scrollbar>
                        )
                    : props.renderEmpty
                        ? (
                                <div
                                    class={[`${props.prefixCls}-dropdown`]}
                                    style={props.containerStyle}
                                >
                                    {props.renderEmpty()}
                                </div>
                            )
                        : (
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
