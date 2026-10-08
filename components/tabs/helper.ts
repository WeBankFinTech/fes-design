import { type VNode, vShow, withDirectives } from 'vue';
import type { Value } from './interface';

/**
 * tab / tab-pane 的身份标识：value 缺省时回退 name（#1024）。
 * 只配 name 的 tab 若拿不到标识，会出现「全部 pane 同时展示、
 * 无选中项、方向键无法聚焦」的问题。
 */
export function getTabKey(
    tab: { value?: Value; name?: Value } | null | undefined,
): Value | undefined {
    return tab?.value ?? tab?.name;
}

export function mapTabPane(
    tabPaneVNodes: VNode[] = [],
    tabValue: Value,
    tabPaneLazyCache: Record<string, boolean>,
) {
    const children: VNode[] = [];
    tabPaneVNodes.forEach((vNode) => {
        const {
            value,
            name,
            'display-directive': _displayDirective,
            displayDirective,
        } = vNode.props;
        const key = value ?? name;
        if (!vNode.key) {
            vNode.key = key;
        }
        if (!vNode.props.key) {
            vNode.props.key = key;
        }
        const show = key === tabValue;
        const directive = _displayDirective || displayDirective;
        if (directive === 'show') {
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (
            directive === 'show:lazy'
            && (tabPaneLazyCache[key] || show)
        ) {
            tabPaneLazyCache[key] = true;
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (show) {
            children.push(vNode);
        }
    });
    return children;
}
