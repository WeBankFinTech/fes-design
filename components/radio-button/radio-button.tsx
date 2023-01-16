import { computed, defineComponent, PropType } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { name, radioGroupKey } from '../radio-group/const';
import useSelect from '../_util/use/useSelect';
import { useTheme } from '../_theme/useTheme';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';

// 样式字符串
const prefixCls = getPrefixCls('radio-button');

const radioButtonProps = {
    disabled: {
        type: Boolean,
    },
    value: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>,
    },
    label: {
        type: [String, Number] as PropType<string | number>,
    },
} as const;

export default defineComponent({
    name: 'FRadioButton',
    props: radioButtonProps,
    emits: [CHANGE_EVENT, UPDATE_MODEL_EVENT],
    setup(props, { slots, emit }) {
        const { checked, disabled, handleClick, group } = useSelect({
            props,
            emit,
            parent: { groupKey: radioGroupKey, name },
        });

        useTheme();

        // 按钮复合样式,根据父组件的传值
        const btnClasses = computed(() => {
            return [
                prefixCls,
                `${prefixCls}-${group.props.size}`,
                `${prefixCls}-${group.props.bordered ? 'border' : 'no-border'}`,
                disabled.value && 'is-disabled',
                checked.value && group.props.bordered
                    ? `is-checked-${group.props.type}-${'border'}`
                    : '',
            ];
        });

        // content样式
        const contentClasses = computed(() => {
            const arr = [`${prefixCls}-content-${group.props.size}`];
            // 无边框的样式
            if (!group.props.bordered && checked.value) {
                arr.push(`${prefixCls}-content-checked`);
                arr.push(`${prefixCls}-content-checked-${group.props.size}`);
                arr.push(`${prefixCls}-content-checked-${group.props.type}`);
            }
            return arr;
        });

        return () => (
            <div class={btnClasses.value} onClick={handleClick}>
                <div class={contentClasses.value}>
                    {slots.default?.() ?? props.label}
                </div>
            </div>
        );
    },
});
