import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import getPrefixCls from '../getPrefixCls';
import useEsc from '../use/useEsc';
import useLockScreen from '../use/useLockScreen';
import Modal from '../../modal/modal';
import { wait } from './helpers';

// useLockScreen 依赖 getScrollBarWidth()（jsdom 无布局，真实实现恒为 0），
// 需要可控的滚动条宽度才能走到「补偿 body padding」分支。仅 mock 这一个函数，
// 其余 dom 工具（hasClass/addClass/removeClass/getStyle）保持真实实现。
const domMocks = vi.hoisted(() => ({ getScrollBarWidth: vi.fn() }));
vi.mock('../../_util/dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../_util/dom')>();
    return { ...actual, getScrollBarWidth: domMocks.getScrollBarWidth };
});

const hiddenCls = getPrefixCls('popup-hidden');

afterEach(() => {
    document.body.classList.remove(hiddenCls);
    document.body.style.paddingRight = '';
    document.body.style.overflowY = '';
    document.body.innerHTML = '';
    domMocks.getScrollBarWidth.mockReset();
    // 还原被 defineProperty 覆写的实例属性（configurable: true → delete 复原原型访问器）
    // @ts-expect-error 实例上删除自己的属性
    delete document.documentElement.clientHeight;
    // @ts-expect-error 实例上删除自己的属性
    delete document.body.scrollHeight;
});

describe('getPrefixCls', () => {
    test('无后缀返回基础前缀 fes（suffixCls 为空的兜底分支）', () => {
        expect(getPrefixCls()).toBe('fes');
    });

    test('有后缀返回 fes-xxx（正常拼接）', () => {
        expect(getPrefixCls('button')).toBe('fes-button');
    });
});

describe('_util/useEsc 真实组件（FModal 消费）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('Escape 键触发 cancel 与 update:show=false（event.code 命中分支）', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, title: 't' },
            attachTo: document.body,
        });
        await nextTick();
        await wait(30);
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        const cancel = wrapper.emitted('cancel');
        expect(cancel).toBeTruthy();
        expect(wrapper.emitted('update:show')![0]).toEqual([false]);
        wrapper.unmount();
    });

    test('非 Escape 键不触发关闭（event.code 未命中分支）', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, title: 't' },
            attachTo: document.body,
        });
        await nextTick();
        await wait(30);
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter' }));
        // 监听存在但未命中 Escape，不产生 cancel
        expect(wrapper.emitted('cancel')).toBeUndefined();
        wrapper.unmount();
    });

    test('escClosable=false 时 Esc 不关闭（escClosable watch 移除监听）', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, title: 't', escClosable: false },
            attachTo: document.body,
        });
        await nextTick();
        await wait(30);
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(wrapper.emitted('cancel')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('_util/useEsc open 受控分支', () => {
    test('open 从 false 变 true 后监听生效（if(open.value) true 分支）', async () => {
        const calls: KeyboardEvent[] = [];
        const open = ref(false);
        const escClosable = ref(false);
        const Comp = defineComponent({
            setup() {
                useEsc((e) => calls.push(e), escClosable, open);
                return () => h('div');
            },
        });
        const wrapper = mount(Comp);
        // escClosable=false：任何状态都不应监听
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(0);
        // open=true 时 escClosable 仍为 false → 短路不监听（escClosable && 分支）
        open.value = true;
        await nextTick();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(0);
        // escClosable=true 后监听生效（escClosable watch 新增监听）
        escClosable.value = true;
        await nextTick();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(1);
        // open=true → false：watch 移除监听，Escape 不再触发
        open.value = false;
        await nextTick();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(1);
        // open 再次变 true（此时 escClosable=true）→ open watch 命中
        // `escClosable && addEventListener` 的监听分支（&& 右侧）
        open.value = true;
        await nextTick();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(2);
        // 卸载组件时 useEsc 自身清理 keydown 监听（onBeforeUnmount）
        wrapper.unmount();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(2);
    });
});

describe('_util/useLockScreen', () => {
    test('FModal 打开锁定 body、关闭解锁（真实组件场景）', async () => {
        const wrapper = mount(Modal, {
            props: { show: true, title: 't' },
            attachTo: document.body,
        });
        await nextTick();
        await wait(30);
        expect(document.body.classList.contains(hiddenCls)).toBe(true);
        await wrapper.setProps({ show: false });
        await nextTick();
        await wait(30);
        expect(document.body.classList.contains(hiddenCls)).toBe(false);
        wrapper.unmount();
    });

    test('页面可滚动时补偿 body paddingRight（scrollBarWidth>0 + overflow 分支）', async () => {
        domMocks.getScrollBarWidth.mockReturnValue(6);
        Object.defineProperty(document.documentElement, 'clientHeight', {
            value: 0,
            configurable: true,
        });
        Object.defineProperty(document.body, 'scrollHeight', {
            value: 100,
            configurable: true,
        });
        document.body.style.paddingRight = '8px';
        const trigger = ref(false);
        const Comp = defineComponent({
            setup() {
                useLockScreen(trigger);
                return () => h('div');
            },
        });
        mount(Comp);
        trigger.value = true;
        await nextTick();
        // 锁定：记录原 padding + 追加滚动条宽度
        expect(document.body.classList.contains(hiddenCls)).toBe(true);
        expect(document.body.style.paddingRight).toBe('14px');
        // 解锁：还原原 padding
        trigger.value = false;
        await nextTick();
        expect(document.body.style.paddingRight).toBe('8px');
        expect(document.body.classList.contains(hiddenCls)).toBe(false);
    });

    test('body 无溢出但有 overflowY:scroll 时仍补偿（|| 右侧分支）', async () => {
        domMocks.getScrollBarWidth.mockReturnValue(6);
        Object.defineProperty(document.documentElement, 'clientHeight', {
            value: 200,
            configurable: true,
        });
        Object.defineProperty(document.body, 'scrollHeight', {
            value: 100,
            configurable: true,
        });
        document.body.style.overflowY = 'scroll';
        const trigger = ref(false);
        const Comp = defineComponent({
            setup() {
                useLockScreen(trigger);
                return () => h('div');
            },
        });
        mount(Comp);
        trigger.value = true;
        await nextTick();
        // bodyHasOverflow=false，但 overflowY=scroll 满足条件二 → 仍补偿
        expect(document.body.classList.contains(hiddenCls)).toBe(true);
        expect(document.body.style.paddingRight).not.toBe('');
        trigger.value = false;
        await nextTick();
        expect(document.body.classList.contains(hiddenCls)).toBe(false);
    });

    test('body 已有隐藏类时不再重复记录 padding（withoutHiddenClass=false 分支）', async () => {
        domMocks.getScrollBarWidth.mockReturnValue(6);
        Object.defineProperty(document.documentElement, 'clientHeight', {
            value: 0,
            configurable: true,
        });
        Object.defineProperty(document.body, 'scrollHeight', {
            value: 100,
            configurable: true,
        });
        // 模拟外部已加锁：body 已带隐藏类
        document.body.classList.add(hiddenCls);
        document.body.style.paddingRight = '9px';
        const trigger = ref(false);
        const Comp = defineComponent({
            setup() {
                useLockScreen(trigger);
                return () => h('div');
            },
        });
        mount(Comp);
        trigger.value = true;
        await nextTick();
        // withoutHiddenClass=false：不再基于当前 padding 追加（保持 9px）
        expect(document.body.style.paddingRight).toBe('9px');
        trigger.value = false;
        await nextTick();
        // cleanup 同样跳过 padding 还原（还原的是外部的锁，不动 padding）
        expect(document.body.style.paddingRight).toBe('9px');
        // 但自身的加锁/解锁流程仍会移除隐藏类
        expect(document.body.classList.contains(hiddenCls)).toBe(false);
    });
});
