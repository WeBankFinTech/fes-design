import {
    Text,
    type VNode,
    type VNodeTypes,
    defineComponent,
    isVNode,
} from 'vue';
import { isArray, isObject, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import FText from '../text';
import { textHighlightProps } from './props';

const prefixCls = getPrefixCls('text-highlight');

export default defineComponent({
    name: 'FTextHighlight',
    props: textHighlightProps,
    setup(props, { slots }) {
        useTheme();

        const createRegExp = (value: string): RegExp => {
            const flags = props.strict ? 'g' : 'gi';
            return new RegExp(`(${value})`, flags);
        };

        // 判断是否相等
        const judgeEqual = (word: string, text: string): boolean => {
            return (
                (props.strict && text === word)
                || (!props.strict && text.toLowerCase() === word.toLowerCase())
            );
        };

        // 渲染高亮的部分
        const renderHighLight = (part: string): VNode => {
            return (
                <FText tag="mark" class="highlight" style={props.markTextStyle}>
                    {part}
                </FText>
            );
        };

        // 渲染文本
        const renderText = (text: string): (string | VNode)[] => {
            let parts: (string | VNode)[] = [text];
            props.searchValues.forEach((value) => {
                const regExp = createRegExp(value);
                parts = parts.reduce((result: (string | VNode)[], part) => {
                    if (isString(part)) {
                        const split = part.split(regExp);
                        return result.concat(
                            split.map((txt: string) => {
                                return judgeEqual(value, txt)
                                    ? renderHighLight(txt)
                                    : txt;
                            }),
                        );
                    } else {
                        return [...result, part];
                    }
                }, [] as (string | VNode)[]);
            });
            return parts;
        };

        // 渲染节点
        const renderNode = (node: VNode): VNode => {
            // 节点的标签
            const NodeType = node.type as VNodeTypes;
            let children;

            // 处理children
            if (isArray(node.children)) {
                // 如果是数组，对每个子节点进行处理
                children = node.children.map((child) => {
                    // 如果子节点是字符串，使用 renderText 函数处理
                    if (isString(child)) {
                        return renderText(child);
                    } else if (isVNode(child)) {
                        // 如果子节点是 VNode，递归使用 renderNode 函数处理
                        return renderNode(child);
                    } else { // 如果子节点既不是字符串也不是 VNode，直接返回它
                        return child;
                    }
                });
            } else if (isString(node.children)) {
                // node.children 是字符串，使用 renderText 函数处理
                children = renderText(node.children);
            } else {
                // 如果 node.children 既不是数组也不是字符串，直接返回它
                children = node.children;
            }

            if (NodeType === Text) {
                // 如果是纯文本，渲染一个空标签
                return <span {...node.props}>{children}</span>;
            } else if (isString(NodeType)) {
                // 字符串（对应 HTML 标签名）
                return <NodeType {...node.props}>{children}</NodeType>;
            } else if (isObject(NodeType)) {
                // 用户自定义的组件对象
                const ChildComponent = NodeType as any;
                const child = node.children as any;
                const childSlots
                    = child && child.default ? child.default() : [];
                return (
                    <ChildComponent {...node.props}>
                        {childSlots.map(renderNode)}
                    </ChildComponent>
                );
            }
        };

        // 渲染内容
        const renderContent = () => {
            if (!slots.default) {
                return '';
            }
            // 遍历内容的所有节点
            return slots.default().map(renderNode);
        };

        return () => <div class={prefixCls}>{renderContent()}</div>;
    },
});
