import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test } from 'vitest';
import Scrollbar from '../scrollbar.vue';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const trackCls = getPrefixCls('scrollbar-track');
const thumbCls = `${trackCls}-thumb`;
const wrapperCls = getPrefixCls('scrollbar');
const containerCls = `${wrapperCls}-container`;

const mountScrollbar = (props = {}) =>
    mount(Scrollbar, {
        props: {
            height: 100,
            ...props,
        },
        slots: {
            default: () => h('div', { style: 'height: 400px;' }, '长内容'),
        },
        attachTo: document.body,
    });

/**
 * 在 onUpdate(setTimeout 0) 执行前注入假布局，产出可控的滚动条几何：
 * container scrollHeight=400、offsetHeight=104 → ratioY=1、size='25px'；
 * 竖向轨道 offsetHeight=100、滑块 offsetHeight=40 → offsetRatio = 100²/400/1/40 = 0.625。
 * getBoundingClientRect 由全局 setup 桩为 0..100。
 */
const stubScrollEnv = (wrapper: ReturnType<typeof mountScrollbar>) => {
    const container = wrapper.find(`.${containerCls}`).element;
    Object.defineProperty(container, 'scrollHeight', {
        value: 400,
        configurable: true,
    });
    Object.defineProperty(container, 'offsetHeight', {
        value: 104,
        configurable: true,
    });
    // scrollTop 需可写（jsdom 只读，bar.vue 回写必须 writable）
    Object.defineProperty(container, 'scrollTop', {
        value: 0,
        configurable: true,
        writable: true,
    });
    const track = wrapper.find(`.${trackCls}.is-vertical`).element;
    Object.defineProperty(track, 'offsetHeight', {
        value: 100,
        configurable: true,
    });
    const thumb = wrapper.find(
        `.${trackCls}.is-vertical .${thumbCls}`,
    ).element;
    Object.defineProperty(thumb, 'offsetHeight', {
        value: 40,
        configurable: true,
    });
    return { container, track, thumb };
};

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FScrollbar bar.vue 轨道/拖拽/翻页分支', () => {
    test('拖拽滑块更新滚动位置（mousedown→mousemove→mouseup 全链路）', async () => {
        const wrapper = mountScrollbar();
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const thumb = wrapper.find(
            `.${trackCls}.is-vertical .${thumbCls}`,
        );
        const { container } = stubScrollEnv(wrapper);
        const before = container.scrollTop;
        expect(before).toBe(0);
        // 按下：barStore = 40 - (clientY - top0) = 40-80 = -40（prevPage 非空）
        await thumb.trigger('mousedown', { button: 0, clientY: 80 });
        expect(
            wrapper.find(`.${trackCls}.is-vertical`).classes(),
        ).toContain('is-hovering');
        // 拖动：offset=100 - thumbClickPosition(80) = 20 → pct 12.5 → scrollTop=50
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientY: 100 }),
        );
        expect(container.scrollTop).toBe(50);
        expect(before).toBe(0);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait(30);
        expect(
            wrapper.find(`.${trackCls}.is-vertical`).classes(),
        ).not.toContain('is-hovering');
        wrapper.unmount();
    });

    test('prevPage 为空时 mousemove 提前返回（!prevPage 分支）', async () => {
        const wrapper = mountScrollbar();
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const { container } = stubScrollEnv(wrapper);
        const thumb = wrapper.find(
            `.${trackCls}.is-vertical .${thumbCls}`,
        );
        // clientY=40 → barStore = 40-40 = 0（falsy prevPage）
        await thumb.trigger('mousedown', { button: 0, clientY: 40 });
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientY: 60 }),
        );
        // prevPage=0 → 直接 return，scrollTop 不变化
        expect(container.scrollTop).toBe(0);
        document.dispatchEvent(new MouseEvent('mouseup'));
        wrapper.unmount();
    });

    test('拖拽期间禁用文本选择，抬起后恢复（document.onselectstart 链路）', async () => {
        const wrapper = mountScrollbar();
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const thumb = wrapper.find(
            `.${trackCls}.is-vertical .${thumbCls}`,
        );
        const initial = document.onselectstart;
        await thumb.trigger('mousedown', { button: 0, clientY: 80 });
        // 拖拽期间 onselectstart 被替换为禁用函数
        expect(document.onselectstart).not.toBe(initial);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await nextTick();
        // mouseup 结束拖拽 → 恢复拖拽前的 onselectstart
        expect(document.onselectstart).toBe(initial);
        wrapper.unmount();
    });

    test('点击轨道翻页（clickTrackHandler 定位滑块）', async () => {
        const wrapper = mountScrollbar();
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const { container } = stubScrollEnv(wrapper);
        const track = wrapper.find(`.${trackCls}.is-vertical`);
        // 轨道 clientY=30：offset=30，thumbHalf=20 → pct=(30-20)*0.625=6.25 → scrollTop=25
        await track.trigger('mousedown', { button: 0, clientY: 30 });
        expect(container.scrollTop).toBe(25);
        wrapper.unmount();
    });

    test('鼠标离开后结束拖拽时隐藏滚动条（cursorLeave 分支）', async () => {
        const wrapper = mountScrollbar({ always: false });
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const track = wrapper.find(`.${trackCls}.is-vertical`);
        const barRoot = wrapper.find(`.${wrapperCls}`);
        // 初始常显关闭 → 隐藏
        expect((track.attributes('style') || '')).toContain('display: none');
        // wrapper 上 mousemove → visible = !!size('25px') → 显示
        await barRoot.trigger('mousemove');
        expect((track.attributes('style') || '').includes('display')).toBe(
            false,
        );
        // mouseleave → cursorLeave=true、visible=false
        await barRoot.trigger('mouseleave');
        expect((track.attributes('style') || '')).toContain('display: none');
        // 拖拽后抬起：cursorLeave 仍为 true → 保持隐藏
        const thumb = wrapper.find(
            `.${trackCls}.is-vertical .${thumbCls}`,
        );
        await thumb.trigger('mousedown', { button: 0, clientY: 80 });
        document.dispatchEvent(new MouseEvent('mouseup'));
        await nextTick();
        expect((track.attributes('style') || '')).toContain('display: none');
        wrapper.unmount();
    });

    test('拖拽中卸载组件时清理拖拽状态（onBeforeUnmount cursorDown 分支）', async () => {
        const wrapper = mountScrollbar();
        stubScrollEnv(wrapper);
        await nextTick();
        await wait(40);
        const thumb = wrapper.find(
            `.${trackCls}.is-vertical .${thumbCls}`,
        );
        const initialSelectstart = document.onselectstart;
        await thumb.trigger('mousedown', { button: 0, clientY: 80 });
        // 记录拖拽期间 onselectstart 被禁用
        expect(document.onselectstart).not.toBeNull();
        wrapper.unmount();
        // 卸载时主动结束拖拽：cursorDown=false、onselectstart 恢复为拖拽前值
        expect(document.onselectstart).toBe(initialSelectstart);
        expect(document.querySelector(`.${trackCls}`)).toBeNull();
    });
});

// 未覆盖说明：`if (cursorDown.value === false)` 的 TRUE 分支（bar.vue:107）是防御性
// 守卫 —— startDrag 在同一同步块内先置 cursorDown=true 再注册 mousemove 监听；
// mouseup/unmount 则在移除监听的同时置回 false（同为同步块），jsdom 无事件队列可
// 插入「cursorDown=false 但监听仍挂载」的窗口，属不可达分支，未硬造。实测兜底：拖拽
// 全链路（mousedown→mousemove→mouseup）由本文件第 1 个用例覆盖，cursorDown 状态
// 由 is-hovering 类与 onselectstart 恢复行为观测。
