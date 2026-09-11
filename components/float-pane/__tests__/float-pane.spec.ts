import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import FloatPane from '../float-pane';
import getPrefixCls from '../../_util/getPrefixCls';
import { getPrefixStorage } from '../../_util/storage';

const prefixCls = getPrefixCls('float-pane');

const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

// 面板通过 Teleport 挂载到 body，需直接查 document
const getContainerEl = () =>
    document.querySelector(`.${prefixCls}-container`);

describe('FloatPane', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('visible=false 时不显示面板（displayDirective 默认 show，v-show 隐藏）', async () => {
        mount(FloatPane);
        await nextTick();
        await nextTick();
        // displayDirective=show 时节点始终渲染，仅通过 v-show 隐藏
        expect(getContainerEl()).toBeTruthy();
        expect(getContainerEl().style.display).toBe('none');
    });

    test('visible=true 渲染面板并渲染默认插槽', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
            },
            slots: {
                default: () => 'pane content',
                title: () => 'pane title',
            },
        });
        await nextTick();
        await nextTick();
        const el = getContainerEl();
        expect(el).toBeTruthy();
        expect(el.style.display).not.toBe('none');
        expect(el.getAttribute('style')).toContain('width: 520px');
        expect(el.getAttribute('style')).toContain('z-index: 3000');
        // 默认位置与初始偏移
        expect(el.getAttribute('style')).toContain('bottom: 50px');
        expect(el.getAttribute('style')).toContain('right: 50px');
        expect(el.getAttribute('style')).toContain('translate(0px, 0px)');
        // 默认插槽与标题插槽内容
        expect(document.querySelector(`.${prefixCls}-body`).textContent).toBe(
            'pane content',
        );
        expect(
            document.querySelector(`.${prefixCls}-header`).textContent,
        ).toContain('pane title');
        wrapper.unmount();
    });

    test('title prop 与关闭按钮', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                title: 'prop title',
            },
        });
        await nextTick();
        await nextTick();
        const header = document.querySelector(`.${prefixCls}-header`);
        expect(header).toBeTruthy();
        expect(header.textContent).toContain('prop title');

        document.querySelector(`.${prefixCls}-close`).click();
        expect(wrapper.emitted('update:visible')).toEqual([[false]]);
        // 关闭后 v-show 隐藏
        await nextTick();
        expect(getContainerEl().style.display).toBe('none');
    });

    test('displayDirective=if 时隐藏则卸载节点', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: false,
                displayDirective: 'if',
            },
        });
        await nextTick();
        expect(getContainerEl()).toBeFalsy();

        await wrapper.setProps({ visible: true });
        await sleep(50);
        expect(getContainerEl()).toBeTruthy();

        await wrapper.setProps({ visible: false });
        await sleep(50);
        expect(getContainerEl()).toBeFalsy();
    });

    test('contentClass 自定义类名', async () => {
        mount(FloatPane, {
            props: {
                visible: true,
                contentClass: 'my-content-class',
            },
        });
        await nextTick();
        await nextTick();
        expect(getContainerEl().classList.contains('my-content-class')).toBe(
            true,
        );
    });

    test('expose: show/hide/resetPosition', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
            },
        });
        await nextTick();
        await nextTick();

        wrapper.vm.hide();
        await nextTick();
        expect(getContainerEl().style.display).toBe('none');

        wrapper.vm.show();
        await nextTick();
        expect(getContainerEl().style.display).not.toBe('none');

        wrapper.vm.resetPosition();
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );
    });

    test('cachePosition 使用 localStorage 恢复拖拽偏移', async () => {
        localStorage.setItem(
            getPrefixStorage('float-pane-test'),
            JSON.stringify({ offsetX: 30, offsetY: 40 }),
        );
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                cachePosition: 'local',
                cachePositionKey: 'float-pane-test',
            },
        });
        await nextTick();
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(30px, 40px)',
        );
        wrapper.unmount();
    });

    test('draggable: mousedown + mousemove 拖拽更新偏移', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: true,
                title: 'drag title',
                // 用 top/left 定位，避免 jsdom 无布局时 right 定位的边界限制
                defaultPosition: { top: '50px', left: '50px' },
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        const header = document.querySelector(`.${prefixCls}-header`);
        expect(header).toBeTruthy();

        // jsdom 中 pageX 由 clientX 计算（无滚动时相等）
        header.dispatchEvent(
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
                clientX: 130,
                clientY: 110,
            }),
        );
        // handleDrag 被节流，等待其执行
        await sleep(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(30px, 10px)',
        );

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        // 结束拖拽后移动不再生效
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 300,
                clientY: 300,
            }),
        );
        await sleep(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(30px, 10px)',
        );
        wrapper.unmount();
    });

    test('draggable=false 时鼠标拖动不生效', async () => {
        const wrapper = mount(FloatPane, {
            props: {
                visible: true,
                draggable: false,
                title: 'no drag title',
            },
            attachTo: document.body,
        });
        await nextTick();
        await nextTick();

        const header = document.querySelector(`.${prefixCls}-header`);
        header.dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 100,
                clientY: 100,
            }),
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 200,
                clientY: 200,
            }),
        );
        await sleep(50);
        await nextTick();
        expect(getContainerEl().getAttribute('style')).toContain(
            'translate(0px, 0px)',
        );
        wrapper.unmount();
    });

    test('getContainer 指定挂载容器', async () => {
        const container = document.createElement('div');
        container.className = 'custom-mount-container';
        document.body.appendChild(container);

        const spy = vi.fn(() => container);
        mount(FloatPane, {
            props: {
                visible: true,
                getContainer: spy,
            },
        });
        await nextTick();
        await nextTick();
        expect(spy).toHaveBeenCalled();
        expect(container.querySelector(`.${prefixCls}-container`)).toBeTruthy();
    });
});
