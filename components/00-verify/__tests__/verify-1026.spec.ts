/**
 * #1026 验证：popper onlyShowTrigger 语义 = "经由 trigger 事件显示后不再隐藏"
 * useTrigger.ts hide() → setHide() 首行 if (props.onlyShowTrigger) return;
 * → hover 的 mouseleave、focus 的 blur 等触发器隐藏路径全部被拦截。
 * 注意（源码 nuance）：popper.tsx 的 useClickOutSide 回调直接调
 * updateVisible(false)，绕过 useTrigger.hide()，不受该 prop 影响。
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../../popper/popper';
import { wait } from '../../_util/__tests__/helpers';

const TEST_TRIGGER = 'verify-1026-trigger';
const CONTENT_CLASS = '.fes-popper';
const CONTENT = '#1026 popper content';

const Wrapped = (props: any, { slots }: any) => h('div', h(FPopper, props, slots));

const _mount = (props: any, slots: any = {}) =>
    mount(Wrapped, {
        props,
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }),
            ...slots,
        },
        attachTo: 'body',
        global: { stubs: { transition: false } },
    } as any);

const isHidden = (wrapper: any) => {
    const el = wrapper.find(CONTENT_CLASS);
    return !el.exists() || (el.attributes('style') || '').includes('display: none');
};

describe('#1026 FPopper onlyShowTrigger 语义验证', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('hover + onlyShowTrigger：显示后 mouseleave 不隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                trigger: 'hover',
                onlyShowTrigger: true,
            },
            { default: () => CONTENT },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await nextTick();
        await wait(50);
        expect(isHidden(wrapper)).toBe(false);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await wait(400); // 超过 hideAfter 默认 200ms + 过渡余量
        // 仍显示 → "仅经 trigger 显示、不经 trigger 隐藏" 语义成立
        expect(isHidden(wrapper)).toBe(false);
        wrapper.unmount();
    });

    test('focus + onlyShowTrigger：显示后 blur 不隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                trigger: 'focus',
                onlyShowTrigger: true,
            },
            { default: () => CONTENT },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('focus');
        await nextTick();
        await wait(50);
        expect(isHidden(wrapper)).toBe(false);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('blur');
        await wait(400);
        expect(isHidden(wrapper)).toBe(false);
        wrapper.unmount();
    });

    test('对照：无 onlyShowTrigger 时 mouseleave 后正常隐藏', async () => {
        const wrapper = _mount(
            { lazy: false, appendToContainer: false, trigger: 'hover' },
            { default: () => CONTENT },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await nextTick();
        await wait(50);
        expect(isHidden(wrapper)).toBe(false);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await wait(400);
        expect(isHidden(wrapper)).toBe(true);
        wrapper.unmount();
    });
});
