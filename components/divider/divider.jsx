import { defineComponent, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';

const prefixCls = getPrefixCls('divider');
const PLACEMENT = ['center', 'left', 'right'];

export default defineComponent({
    name: 'FDivider',
    props: {
        // 是否是垂直方向
        vertical: {
            type: Boolean,
            default: false,
        },
        // 文字的位置
        titlePlacement: {
            type: String,
            default: PLACEMENT[0],
            validator(value) {
                return PLACEMENT.includes(value);
            },
        },
    },
    setup(props, { slots }) {
        useTheme();
        const classList = computed(() =>
            [prefixCls, props.vertical && 'is-vertical']
                .filter(Boolean)
                .join(' '),
        );
        return () => (
            <div className={classList.value}>
                {!props.vertical ? (
                    <div class={`${prefixCls}-text is-${props.titlePlacement}`}>
                        {slots.default?.()}
                    </div>
                ) : null}
            </div>
        );
    },
});
