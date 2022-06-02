import { defineComponent, ExtractPropTypes, PropType, VNodeChild } from 'vue';
import { isFunction, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import LoadingOutlined from '../icon/LoadingOutlined';
import { COMPONENT_NAME } from './const';
import useCascaderMenu from './useCascaderMenu';
import type { InnerCascaderOption } from './interface';
import CascaderNode from './cascaderNode';
import Scrollbar from '../scrollbar';

const prefixCls = getPrefixCls('cascader-menu');

const cascaderMenuProps = {
    menuKey: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    initialLoaded: Boolean,
    listEmptyText: String,
} as const;

export type CascaderMenuProps = Partial<
    ExtractPropTypes<typeof cascaderMenuProps>
>;

export default defineComponent({
    name: COMPONENT_NAME.CASCADER_MENU,
    props: cascaderMenuProps,
    setup(props) {
        const { menuNodes } = useCascaderMenu(props);

        const renderNode = (node: InnerCascaderOption) => {
            const itemSlots: {
                [key: string]: () => VNodeChild | string;
            } = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix as string;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix as string;
            }
            return (
                <CascaderNode
                    key={node.value}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                ></CascaderNode>
            );
        };
        const renderNodes = (nodes: InnerCascaderOption[]) =>
            nodes.map((node) => renderNode(node));

        return () => (
            <Scrollbar
                class={`${prefixCls}-scrollbar`}
                containerClass={`${prefixCls}-dropdown`}
                key={props.menuKey}
            >
                <div class={`${prefixCls}`} role="cascader-menu">
                    {menuNodes.value.length ? (
                        renderNodes(menuNodes.value)
                    ) : props.initialLoaded ? (
                        <div class={`${prefixCls}-null`}>
                            {props.listEmptyText}
                        </div>
                    ) : (
                        <div class={`${prefixCls}-loading`}>
                            <LoadingOutlined />
                        </div>
                    )}
                </div>
            </Scrollbar>
        );
    },
});
