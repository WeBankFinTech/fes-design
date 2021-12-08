export const tabProps = {
    key: [String, Number],
    value: {
        type: [String, Number],
        required: true,
    },
    name: [String, Number],
    disabled: Boolean,
    closable: Boolean,
    displayDirective: {
        type: String,
        default: 'if',
        validator(value) {
            return ['if', 'show'].includes(value);
        },
    },
};

/**
 * 计算TabBar样式
 * @param { Element } tabEl tab元素
 * @param { 'left' | 'top' | 'right' | 'bottom' } pos tab的展示位置
 * @returns
 */
export function computeTabBarStyle(tabEl, pos = 'top') {
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
            style.transform = `translate(0px, ${currRect.top - firstRect.top}px)`;
            break;
        case 'top':
        case 'bottom':
            style.width = `${currRect.width}px`;
            style.height = '2px';
            style.transform = `translate(${currRect.left - firstRect.left}px, 0px)`;
            break;
        default:
    }
    return style;
}
