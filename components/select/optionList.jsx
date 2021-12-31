import { defineComponent } from 'vue';
import Scrollbar from '../scrollbar';
import Ellipsis from '../ellipsis';
import VirtualList from '../virtual-list';
import CheckOutlined from '../icon/CheckOutlined';
import { noop } from '../_util/utils';

export default defineComponent({
    props: {
        prefixCls: String,
        containerStyle: {
            type: Object,
            default() {
                return {};
            },
        },
        options: {
            type: Array,
            default() {
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
    },
    setup(props) {
        const renderLabel = (option, isSelected, prefixCls) => {
            if (option.ctx?.slots?.default) {
                return option.ctx.slots.default({ isSelected });
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

        const renderOption = (option) => {
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

        const renderList = () =>
            props.options.length ? (
                props.options.map((option) => renderOption(option))
            ) : (
                <div class={`${props.prefixCls}-null`}>{props.emptyText}</div>
            );

        const renderDefault = ({ source }) => renderOption(source);

        return () =>
            props.options.length > 50 ? (
                <VirtualList
                    dataSources={props.options}
                    dataKey={'value'}
                    estimateSize={32}
                    keeps={14}
                    style={props.containerStyle}
                    class={`${props.prefixCls}-dropdown is-max-height`}
                    v-slots={{ default: renderDefault }}
                ></VirtualList>
            ) : (
                <Scrollbar
                    containerStyle={props.containerStyle}
                    containerClass={`${props.prefixCls}-dropdown`}
                >
                    {renderList()}
                </Scrollbar>
            );
    },
});
