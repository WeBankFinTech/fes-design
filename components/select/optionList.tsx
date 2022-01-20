import { h, defineComponent, Fragment, PropType, CSSProperties } from 'vue';
import Scrollbar from '../scrollbar/scrollbar.vue';
import Ellipsis from '../ellipsis/ellipsis';
import VirtualList from '../virtual-list/virtualList';
import CheckOutlined from '../icon/CheckOutlined';
import { noop } from '../_util/utils';

import type { SelectOption } from './interface';

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
    emptyText: String,
} as const;

export default defineComponent({
    props: optionListProps,
    setup(props) {
        const renderLabel = (
            option: SelectOption,
            isSelected: boolean,
            prefixCls: string,
        ) => {
            if ((option as any).slots?.default) {
                return (option as any).slots.default({ isSelected });
            }
            if (option.label) {
                return (
                    <>
                        <Ellipsis triggerClass={`${prefixCls}-label`}>
                            {option.label}
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

        const renderOption = (option: SelectOption) => {
            const value = option.value;
            const isSelected = props.isSelect(value);
            const prefixCls = `${props.prefixCls}-option`;
            const classList = [
                prefixCls,
                isSelected && 'is-checked',
                option.disabled && 'is-disabled',
            ].filter(Boolean);
            return (
                <div
                    class={classList}
                    onClick={() => {
                        if (option.disabled) {
                            return;
                        }
                        props.onSelect(value);
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
                    onMousedown={(e: Event) => {
                        e.preventDefault();
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
                    onMousedown={(e: Event) => {
                        e.preventDefault();
                    }}
                    containerStyle={props.containerStyle}
                    containerClass={`${props.prefixCls}-dropdown`}
                >
                    {props.options.map((option) => renderOption(option))}
                </Scrollbar>
            ) : (
                <div
                    onMousedown={(e: Event) => {
                        e.preventDefault();
                    }}
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
