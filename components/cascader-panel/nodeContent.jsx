import { defineComponent, h, inject } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './const';

const prefixCls = getPrefixCls('cascader-node-content');

export default defineComponent({
    name: 'NodeContent',
    props: {
        node: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);
        const { node } = props;
        const { data, label } = node;
        const { renderLabelFn } = panel;

        return () =>
            h(
                'span',
                {
                    class: {
                        [prefixCls]: true,
                        'is-multiple': panel.multiple,
                    },
                },
                renderLabelFn ? renderLabelFn({ node, data }) : label,
            );
    },
});
