import { vShow, withDirectives, type VNode } from 'vue';
import type { Position, Value } from './interface';

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

/**
 * 计算TabBar样式
 */
export function computeTabBarStyle(tabEl: Element, pos: Position = 'top') {
    const style = {
        width: '0px',
        height: '0px',
        transform: '',
    };
    if (!tabEl || tabEl.children.length <= 0) return style;
    const firstRect = tabEl.parentElement.children[0].getBoundingClientRect();
    const currRect = tabEl.children[0].getBoundingClientRect();
    switch (pos) {
        case 'left':
        case 'right':
            style.width = '2px';
            style.height = `${currRect.height}px`;
            style.transform = `translate(0px, ${
                currRect.top - firstRect.top
            }px)`;
            break;
        case 'top':
        case 'bottom':
            style.width = `${currRect.width}px`;
            style.height = '2px';
            style.transform = `translate(${
                currRect.left - firstRect.left
            }px, 0px)`;
            break;
        default:
    }
    return style;
}
