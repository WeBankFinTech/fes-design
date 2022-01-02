import { h, computed, defineComponent, inject, PropType } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './props';

import type { CascaderNode } from './interface'

const prefixCls = getPrefixCls('cascader-node-content');

export default defineComponent({
    name: 'NodeContent',
    props: {
        node: {
            type: Object as PropType<CascaderNode>,
            required: true,
        },
    },
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);
        const { node } = props;
        const { data, label } = node;
        const { renderLabelFn } = panel;

        const classes = computed(() => ({
            [prefixCls]: true,
            'is-multiple': panel.multiple,
        }));

        return () => (
            <span class={classes.value}>
                {renderLabelFn ? renderLabelFn({ node, data }) : label}
            </span>
        );
    },
});
