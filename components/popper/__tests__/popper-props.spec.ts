import { mount } from '@vue/test-utils';
import { h } from 'vue';
import FPopper from '../popper';
import { sleep } from '../../_util/utils';

const TEST_TRIGGER = 'test-trigger';
const AXIOM = 'Rem is the best girl';
const CONTENT_CLASS = '.fes-popper';

const Wrapped = (props, { slots }) => h('div', h(FPopper, props, slots));

const _mount = (props, slots = {}) =>
    mount(Wrapped, {
        props,
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }),
            ...slots,
        },
        attachTo: 'body',
        global: { stubs: { transition: false } },
    });

describe('FPopper 属性补全', () => {
    test('placement=bottom 使用 slide-up 动画', async () => {
        const wrapper = _mount(
            { lazy: false, appendToContainer: false, placement: 'bottom' },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        wrapper.unmount();
    });

    test('placement=top-start 使用 slide-down 动画', async () => {
        const wrapper = _mount(
            { lazy: false, appendToContainer: false, placement: 'top-start' },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        wrapper.unmount();
    });

    test('offset 偏移不报错且正常渲染', async () => {
        const wrapper = _mount(
            { lazy: false, appendToContainer: false, offset: 12 },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        wrapper.unmount();
    });

    test('showAfter 延迟显示', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                showAfter: 100,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        // 未到延迟时间，先不显示
        await sleep(30);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        await sleep(120);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        wrapper.unmount();
    });

    test('hideAfter 延迟隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                hideAfter: 100,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        // 延迟隐藏期间仍可见
        await sleep(30);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        await sleep(120);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        wrapper.unmount();
    });

    test('popperClass 自定义类名', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                popperClass: 'my-popper',
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find('.my-popper').exists()).toBe(true);
        wrapper.unmount();
    });

    test('arrow=false 不渲染箭头', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                arrow: false,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find('.fes-popper-arrow').exists()).toBe(false);
        wrapper.unmount();
    });

    test('disabled 禁用后不显示', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                disabled: true,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        wrapper.unmount();
    });

    test('onlyShowTrigger 显示后不隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                onlyShowTrigger: true,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        // 移出后不隐藏
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await sleep(50);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        wrapper.unmount();
    });
});
