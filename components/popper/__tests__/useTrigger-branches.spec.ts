import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../popper';

// useTrigger 分支补全：onlyShowTrigger 守卫、disabled 三态（boolean 真/
// 假/函数）、hideAfter/showAfter 延迟路径、focus/blur/contextmenu 事件、
// onPopperMouseLeave 的 trigger 类型防误关分支

const TEST_TRIGGER = 'test-trigger';

afterEach(() => {
    document.body.innerHTML = '';
});

const Wrapped = (props: any, { slots }: any) =>
    h('div', h(FPopper, { lazy: false, appendToContainer: false, ...props }, slots));

const _mount = (props: Record<string, any>) =>
    mount(Wrapped, {
        props,
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }),
            default: () => h('div', 'content'),
        },
        attachTo: 'body',
    });

describe('useTrigger 分支补全', () => {
    test('onlyShowTrigger: 手动控制模式下 mouseleave 不隐藏', async () => {
        const wrapper = _mount({
            trigger: 'hover',
            onlyShowTrigger: true,
            modelValue: true,
        });
        await nextTick();
        await new Promise((r) => setTimeout(r, 50));
        // 直接对 popper 内容 mouseleave：onlyShowTrigger 下 hide 守卫拦截
        const popperEl = document.querySelector('.fes-popper') as HTMLElement;
        expect(popperEl).not.toBeNull();
        popperEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        await new Promise((r) => setTimeout(r, 50));
        expect(popperEl.getAttribute('style') ?? '').not.toContain('display: none');
        wrapper.unmount();
    });

    test('disabled=true 时 hover 不展开（boolean 守卫分支）', async () => {
        const wrapper = _mount({
            trigger: 'hover',
            disabled: true,
            modelValue: false,
        });
        await nextTick();
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        wrapper.unmount();
    });

    test('disabled=false 时 hover 正常展开', async () => {
        const wrapper = _mount({ trigger: 'hover', disabled: false });
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
        wrapper.unmount();
    });

    test('disabled 为函数返回 true 时不展开（function 守卫分支）', async () => {
        const disabled = vi.fn(() => true);
        const wrapper = _mount({
            trigger: 'hover',
            disabled,
            modelValue: false,
        });
        await nextTick();
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await nextTick();
        expect(disabled).toHaveBeenCalled();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        wrapper.unmount();
    });

    test('hideAfter 延迟隐藏：延迟窗口内到达才隐藏', async () => {
        vi.useFakeTimers();
        try {
            const wrapper = _mount({ trigger: 'hover', hideAfter: 100 });
            await nextTick();
            const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
            await $trigger.trigger('mouseenter');
            await nextTick();
            expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
            await $trigger.trigger('mouseleave');
            // 延迟窗口内尚未隐藏
            expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
            await vi.advanceTimersByTimeAsync(120);
            expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
            wrapper.unmount();
        } finally {
            vi.useRealTimers();
        }
    });

    test('showAfter 延迟显示', async () => {
        vi.useFakeTimers();
        try {
            const wrapper = _mount({ trigger: 'hover', showAfter: 80 });
            await nextTick();
            const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
            await $trigger.trigger('mouseenter');
            await nextTick();
            // 未到延迟：尚未显示
            expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
            await vi.advanceTimersByTimeAsync(100);
            expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
            wrapper.unmount();
        } finally {
            vi.useRealTimers();
        }
    });

    test('focus/blur 触发展开与关闭', async () => {
        const wrapper = _mount({ trigger: 'focus' });
        await nextTick();
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger('focus');
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
        await $trigger.trigger('blur');
        // 隐藏有过渡动画：vi.waitFor 轮询至隐藏（先例模式）
        await vi.waitFor(() => {
            expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('contextmenu 右键开合（含 toggle 关闭分支）', async () => {
        const wrapper = _mount({ trigger: 'contextmenu' });
        await nextTick();
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger('contextmenu', { clientX: 66, clientY: 88 });
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(true);
        // contextmenu 模式的 click 分支：visible 已 true → toggle 关闭
        await $trigger.trigger('click');
        await vi.waitFor(() => {
            expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('onPopperMouseLeave: click/focus/contextmenu 触发下不误关弹层', async () => {
        for (const trigger of ['click', 'focus', 'contextmenu'] as const) {
            const wrapper = _mount({ trigger, modelValue: true });
            await nextTick();
            await new Promise((r) => setTimeout(r, 50));
            const popperEl = document.querySelector('.fes-popper') as HTMLElement;
            expect(popperEl).not.toBeNull();
            popperEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
            await new Promise((r) => setTimeout(r, 50));
            expect(
                (popperEl.getAttribute('style') ?? '').includes('display: none'),
            ).toBe(false);
            wrapper.unmount();
        }
    });
});
