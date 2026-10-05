import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Drawer from '../drawer';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-drawer';

const mountDrawer = (props: Record<string, unknown>) =>
    mount(Drawer, {
        props: { show: true, title: 't', ...props },
        attachTo: document.body,
    });

// jsdom 无布局，offsetWidth/offsetHeight 需 mock
const mockSize = (el: HTMLElement, value: number) => {
    Object.defineProperty(el, 'offsetWidth', { value, configurable: true });
    Object.defineProperty(el, 'offsetHeight', { value, configurable: true });
};

const getDragHandle = () =>
    document.querySelector(`.${prefixCls}-drag-icon`)!.parentElement as HTMLElement;

const getWrapperEl = () =>
    document.querySelector(`.${prefixCls}-wrapper`) as HTMLElement;

const down = (x: number, y = 0) =>
    getDragHandle().dispatchEvent(
        new MouseEvent('mousedown', { clientX: x, clientY: y, bubbles: true }),
    );
const move = (x: number, y = 0) =>
    document.dispatchEvent(
        new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true }),
    );
const up = (x: number, y = 0) =>
    document.dispatchEvent(
        new MouseEvent('mouseup', { clientX: x, clientY: y, bubbles: true }),
    );

// jsdom 默认 window.innerWidth = 1024（useWindowSize 的 clientMaxSize）
const WINDOW_MAX = 1024;
const MIN = 200;

// 不可达分支说明（useResizable.ts）：
// 1) L12 `!props.resizable`：resizableRange 仅在 doResize（拖拽中）消费，而 mousemove 监听
//    只在 resizable=true 时挂载 → resizable=false 时 calcResizableRange 根本不会被调用。
// 2) L95 `if (drawerRef.value)` else：拖拽把手位于 drawer 容器内，mousedown 触发时 ref
//    必然已赋值（jsdom 同步挂载）→ else 不可达。
// 上述两支均为防御性代码，无法通过真实交互触达，故不硬造用例。
// 另：L33（百分比格式）的 else 与 L50（calculatedDimension 为 nil）通过「无单位字符串」
// 尺寸 formatSize 回退 undefined 的真实路径覆盖（见下方两个用例）。

describe('FDrawer resizable 尺寸格式与边界', () => {
    test('resizeMax 支持百分比字符串（50% = 512）', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'left',
            width: 400,
            resizeMax: '50%',
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // left：nextSize = lastSize + offset，大幅右拖 → 超过 max 512 → 钳制
        down(100);
        move(100, 0);
        await wait(20);
        move(10000, 0);
        await wait(50);
        up(10000, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('512px');
        wrapper.unmount();
    });

    test('resizeMin 支持百分比字符串（25% = 256）', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            width: 400,
            resizeMin: '25%',
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        // right：nextSize = lastSize - offset，右拖缩小 → min 256 钳制
        down(0);
        move(1000, 0);
        await wait(50);
        up(1000, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('256px');
        wrapper.unmount();
    });

    test('resizeMin > resizeMax：告警并忽略配置范围', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            width: 400,
            resizeMin: 500,
            resizeMax: 300,
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        down(100);
        move(40, 0); // offset=-60 → nextSize=460（若范围生效会被 max 300 钳制）
        await wait(50);
        up(40, 0);
        await wait(50);
        expect(warnSpy).toHaveBeenCalled();
        expect(getWrapperEl().getAttribute('style')).toContain('460px');
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('未按下时 mousemove/mouseup 提前返回，不改变尺寸', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right', width: 400 });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        const styleBefore = getWrapperEl().getAttribute('style');
        // 未 mousedown 直接 mousemove / mouseup → isActive=false 守卫
        move(300, 0);
        await wait(20);
        up(300, 0);
        await wait(20);
        expect(getWrapperEl().getAttribute('style')).toBe(styleBefore);
        // 随后真实按下拖动仍生效
        down(200);
        move(140, 0); // offset=-60 → 460
        await wait(50);
        up(140, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('460px');
        wrapper.unmount();
    });

    test('兜底最小尺寸：无 resizeMin 时钳制到 DRAWER_MIN_SIZE(200)', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right', width: 400 });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        down(0);
        move(1000, 0); // nextSize = 400 - 1000 = -600 < 200
        await wait(50);
        up(1000, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('200px');
        wrapper.unmount();
    });

    test('兜底最大尺寸：无 resizeMax 时钳制到窗口宽度', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'right', width: 400 });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        down(100);
        move(-4000, 0); // nextSize = 400 + 4000 > 1024
        await wait(50);
        up(-4000, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain(`${WINDOW_MAX}px`);
        expect(getWrapperEl().getAttribute('style')).not.toContain(`${MIN}px`);
        wrapper.unmount();
    });

    test('bottom placement：拖拽类名与 clientY 纵向计算', async () => {
        const wrapper = mountDrawer({ resizable: true, placement: 'bottom', height: 300 });
        await nextTick();
        await wait(50);
        const dragEl = getDragHandle();
        expect(dragEl.classList.contains(`${prefixCls}-drag-bottom`)).toBe(true);
        mockSize(getWrapperEl(), 300);
        // bottom：popDirection=vertical → 用 clientY；placement 不在 left/top →
        // nextSize = lastSize - offset = 300 - (40-100) = 360
        down(0, 100);
        move(0, 40);
        await wait(50);
        up(0, 40);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('360px');
        wrapper.unmount();
    });

    test('resizeMin 为无单位字符串：formatSize 回退 undefined，范围被忽略', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            width: 400,
            resizeMin: '300', // 非 px 非 % → 无法解析
        });
        await nextTick();
        await wait(50);
        mockSize(getWrapperEl(), 400);
        down(100);
        move(40, 0); // offset=-60 → nextSize=460；若 min=300 生效会被钳制到 300
        await wait(50);
        up(40, 0);
        await wait(50);
        const style = getWrapperEl().getAttribute('style')!;
        expect(style).toContain('460px');
        expect(style).not.toContain('300px');
        wrapper.unmount();
    });

    test('dimension 为无单位字符串：calculatedDimension 解析为 undefined 分支', async () => {
        const wrapper = mountDrawer({
            resizable: true,
            placement: 'right',
            dimension: '300',
        });
        await nextTick();
        await wait(50);
        // dimension 无单位字符串（'300'）无法被 formatSize 解析成数值 → calculatedDimension
        // 为 undefined（走 else 分支）；宽度按字符串原样交给样式层，jsdom 丢弃非法
        // unit 值（height: 100% 保留），但不影响主流程
        expect(getWrapperEl().getAttribute('style')).toContain('height: 100%');
        mockSize(getWrapperEl(), 300);
        down(100);
        move(40, 0); // nextSize = 300 - (-60) = 360 → 拖拽仍基于 offsetWidth 生效
        await wait(50);
        up(40, 0);
        await wait(50);
        expect(getWrapperEl().getAttribute('style')).toContain('360px');
        wrapper.unmount();
    });
});
