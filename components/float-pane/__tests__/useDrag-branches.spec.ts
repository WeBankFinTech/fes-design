import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import FloatPane from '../float-pane';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('float-pane');

// 面板 Teleport 到 body，直接查 document；容器即 document.body 时才启用边界 clamp
const getContainerEl = () =>
    document.querySelector(`.${prefixCls}-container`) as HTMLElement;
const getHeaderEl = () =>
    document.querySelector(`.${prefixCls}-header`) as HTMLElement;

// jsdom 中 pageX 由 clientX 计算（无滚动，二者相等）；
// vitest.setup.ts 未桩 offsetHeight/offsetWidth，jsdom 下均为 0：
//   bottom 50px → Y 限位 [-(innerHeight-50-0), 50]，right 50px → X 限位 [-(innerWidth-50-100), 50+(0-100)]
// handleDrag 被 throttle 包裹，每次 mousemove 后需 wait 让其执行
const drag = async (from: [number, number], to: [number, number]) => {
    getHeaderEl().dispatchEvent(
        new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: from[0],
            clientY: from[1],
        }),
    );
    document.dispatchEvent(
        new MouseEvent('mousemove', {
            bubbles: true,
            clientX: to[0],
            clientY: to[1],
        }),
    );
    await wait(50);
    await nextTick();
};

describe('FFloatPane useDrag 分支补全（边界 clamp 与拖拽把柄判定）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        localStorage.clear();
        sessionStorage.clear();
    });

    test('bottom/right px 定位：Y 上下越界、X 左右越界均被 clamp 拦截，界内拖拽精确生效', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'clamp drag',
                // 组件默认定位 bottom:50px / right:50px
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();
        expect(getHeaderEl()).not.toBeNull();

        // 上抛越界：offsetY=-766 < min(-718) → 拦截（useDrag.ts:93）
        await drag([100, 767], [100, 1]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );

        // 下拉越界：offsetY=299 > max(50) → 拦截（useDrag.ts:96）
        await drag([100, 1], [100, 300]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );

        // 界内左移：offsetX=-499 ∈ [-874, -50]，offsetY=0 ∈ [-718, 50] → 生效
        await drag([500, 100], [1, 100]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(-499px, 0px)',
        );

        // 继续左移越界：offsetX=-998 < min(-874) → 拦截（useDrag.ts:101）
        await drag([500, 100], [1, 100]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(-499px, 0px)',
        );

        // 右移越界：offsetX=1 > max(-50)（右锚定面板无法右移）→ 拦截（useDrag.ts:104）
        await drag([100, 100], [600, 100]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(-499px, 0px)',
        );
        wrapper.unmount();
    });

    test('top/left px 定位：top>0 时 min=-top 的 clamp 与界内拖拽', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'top-left drag',
                defaultPosition: { top: '50px', left: '50px' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        // 上移越界：offsetY=-70 < min(-50) → 拦截
        await drag([100, 100], [100, 30]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );

        // 左移越界：offsetX=-70 < min(-50) → 拦截
        await drag([100, 100], [30, 100]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );

        // 界内斜向拖拽：offset = (50, 50) 精确写入 transform
        await drag([100, 100], [150, 150]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(50px, 50px)',
        );
        wrapper.unmount();
    });

    test('top/left 为 0px：min 取 0（top>0 为 false 的回退路径）且可自由拖入正方向', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'zero drag',
                defaultPosition: { top: '0px', left: '0px' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        // 上移：offsetY=-40 < min(0) → 拦截（证明 top=0 时 min 为 0 而非 -top）
        await drag([100, 100], [100, 60]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );

        // 右下拖拽：offset=(200, 299) 均在界内 → 生效
        await drag([100, 1], [300, 300]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(200px, 299px)',
        );
        wrapper.unmount();
    });

    test('百分比定位（非 px 单位）不启用边界计算，拖拽自由移动', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'percent drag',
                defaultPosition: { bottom: '50%', right: '50%' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        // 无 clamp：大幅移动直接生效
        await drag([100, 100], [200, 200]);
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(100px, 100px)',
        );
        wrapper.unmount();
    });

    test('容器非 document.body 时返回 null 限位，拖拽不受边界约束', async () => {
        const container = document.createElement('div');
        container.className = 'drag-custom-container';
        document.body.appendChild(container);

        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'custom container drag',
                getContainer: () => container,
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();
        // 面板挂载在自定义容器内
        expect(
            container.querySelector(`.${prefixCls}-container`),
        ).not.toBeNull();

        // 大幅移动（body 容器下会被 X-max 拦截）→ 无限位时自由生效
        getHeaderEl().dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 100,
                clientY: 100,
            }),
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 600,
                clientY: 300,
            }),
        );
        await wait(50);
        await nextTick();
        expect(
            container.querySelector(`.${prefixCls}-container`).getAttribute('style'),
        ).toContain('translate(500px, 200px)');
        wrapper.unmount();
        container.remove();
    });

    test('mousemove 越出窗口坐标（上/左/右/下边界）不更新位置', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'guard drag',
                defaultPosition: { top: '0px', left: '0px' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        const guardMove = async (x: number, y: number) => {
            getHeaderEl().dispatchEvent(
                new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: 100,
                    clientY: 100,
                }),
            );
            document.dispatchEvent(
                new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: x,
                    clientY: y,
                }),
            );
            await wait(50);
            await nextTick();
            // 守卫命中：transform 始终不更新
            expect(getContainerEl().getAttribute('style')).toContain(
                'translate(0px, 0px)',
            );
            document.dispatchEvent(
                new MouseEvent('mouseup', { bubbles: true }),
            );
        };

        // clientY <= 0 / clientX <= 0 / clientX >= innerWidth / clientY >= innerHeight
        await guardMove(100, 0);
        await guardMove(0, 100);
        await guardMove(window.innerWidth, 100);
        await guardMove(100, window.innerHeight);
        wrapper.unmount();
    });

    test('拖拽把柄生命周期：mousedown 加 dragging 类 → mousemove 生效 → mouseup 结束后移动失效', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'lifecycle drag',
                defaultPosition: { top: '50px', left: '50px' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        const draggingCls = `${prefixCls}-header--dragging`;
        expect(getHeaderEl().classList.contains(draggingCls)).toBe(false);

        getHeaderEl().dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 100,
                clientY: 100,
            }),
        );
        await nextTick();
        // 按下即进入拖拽态
        expect(getHeaderEl().classList.contains(draggingCls)).toBe(true);

        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 150,
                clientY: 150,
            }),
        );
        await wait(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(50px, 50px)',
        );

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        await nextTick();
        // 抬起后退出拖拽态
        expect(getHeaderEl().classList.contains(draggingCls)).toBe(false);
        // 抬起后的 mousemove 不再更新位置
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 300,
                clientY: 300,
            }),
        );
        await wait(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(50px, 50px)',
        );

        // 再次按下可开启新一轮拖拽
        getHeaderEl().dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                clientX: 100,
                clientY: 100,
            }),
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 110,
                clientY: 110,
            }),
        );
        await wait(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(60px, 60px)',
        );
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        wrapper.unmount();
    });
});
