import { vShow, withDirectives, type VNode } from 'vue';
import { type Value } from './interface';

export function mapTabPane(
    tabPaneVNodes: VNode[] = [],
    tabValue: Value,
    tabPaneLazyCache: Record<string, boolean>,
) {
    const children: VNode[] = [];
    tabPaneVNodes.forEach((vNode) => {
        const {
            value,
            'display-directive': _displayDirective,
            displayDirective,
        } = vNode.props;
        if (!vNode.key) vNode.key = value;
        if (!vNode.props.key) vNode.props.key = value;
        const show = value === tabValue;
        const directive = _displayDirective || displayDirective;
        if (directive === 'show') {
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (
            directive === 'show:lazy' &&
            (tabPaneLazyCache[value] || show)
        ) {
            tabPaneLazyCache[value] = true;
            children.push(withDirectives(vNode, [[vShow, show]]));
        } else if (show) {
            children.push(vNode);
        }
    });
    return children;
}
