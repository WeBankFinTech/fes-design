// jsdom 不做真实布局，Element.getBoundingClientRect() 返回全 0。
// 这会让依赖元素尺寸的组件逻辑误判（如 Popper 的「trigger 不可见」守卫，
// 会反复 updateVisible(false) 与受控的 open=true 形成递归，触发
// "Maximum recursive updates exceeded"）。这里统一返回非零尺寸以避免误判。
// 注意：setupFiles 对所有环境生效（含 node 环境的 SSR 冒烟测试），
// node 下不存在 Element 全局，需要守卫。
if (typeof Element !== 'undefined') {
    const mockRect = {
        width: 100,
        height: 100,
        top: 0,
        left: 0,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON() {
            return mockRect;
        },
    } as DOMRect;

    Element.prototype.getBoundingClientRect = () => mockRect;
}
