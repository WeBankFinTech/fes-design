import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../popper';
import PopupManager from '../../_util/popupManager';
import { sleep } from '../../_util/utils';

const TEST_TRIGGER = 'test-trigger';
const AXIOM = 'Rem is the best girl';
const WRAPPER_CLASS = '.fes-popper-wrapper';
const CONTENT_CLASS = '.fes-popper';
const ARROW_CLASS = '.fes-popper';
const MOUSE_ENTER_EVENT = 'mouseenter';
const MOUSE_LEAVE_EVENT = 'mouseleave';
const CLICK_EVENT = 'click';
const FOCUS_EVENT = 'focus';
const BLUR_EVENT = 'blur';

const Wrapped = (props, { slots }) => h('div', h(FPopper, props, slots));

const _mount = (props, slots = {}) =>
    mount(Wrapped, {
        props,
        slots: {
            trigger: () =>
                h('div', {
                    class: TEST_TRIGGER,
                }),
            ...slots,
        },
        attachTo: 'body',
    });

describe('Popper', () => {
    test('render default', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
            },
            {
                default: () => AXIOM,
            },
        );

        expect(wrapper.text()).toEqual(AXIOM);
    });

    test('append to body', async () => {
        const wrapper = _mount({
            lazy: false,
        });

        expect(wrapper.find(WRAPPER_CLASS).exists()).toBe(false);

        await wrapper.setProps({
            appendToContainer: false,
        });

        expect(wrapper.find(WRAPPER_CLASS).exists()).toBe(true);
    });

    test('popper z-index should be dynamical', () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
        });

        expect(
            Number.parseInt(
                window.getComputedStyle(wrapper.find(WRAPPER_CLASS).element)
                    .zIndex,
            ),
        ).toBeLessThanOrEqual(PopupManager.zIndex);
    });

    test('should show popper when mouse entered and hide when popper leave', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
        });
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        await nextTick();
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(true);
        await $trigger.trigger(MOUSE_LEAVE_EVENT);
        // 消失时存在动画，需要等待动画结束才隐藏
        await sleep(300);
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
    });

    test('trigger click', async () => {
        const wrapper = _mount({
            trigger: 'click',
            lazy: false,
            appendToContainer: false,
        });
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(CLICK_EVENT);
        await nextTick();
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(true);
        await $trigger.trigger(CLICK_EVENT);
        // 消失时存在动画，需要等待动画结束才隐藏
        await sleep(300);
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
    });

    test('trigger focus', async () => {
        const wrapper = _mount({
            trigger: 'focus',
            lazy: false,
            appendToContainer: false,
        });
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(FOCUS_EVENT);
        await nextTick();
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(true);
        await $trigger.trigger(BLUR_EVENT);
        // 消失时存在动画，需要等待动画结束才隐藏
        await sleep(300);
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
    });

    test('render lazy', async () => {
        const wrapper = _mount({
            appendToContainer: false,
        });
        expect(wrapper.find(WRAPPER_CLASS).exists()).toBe(false);
        await wrapper.setProps({
            lazy: false,
        });
        expect(wrapper.find(WRAPPER_CLASS).exists()).toBe(true);
    });

    test('disabled', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            disabled: true,
        });
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        await nextTick();
        expect(wrapper.find(CONTENT_CLASS).isVisible()).toBe(false);
    });

    test('popperClass', async () => {
        const popperClass = 'test';
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            popperClass: popperClass,
        });
        expect(wrapper.find(CONTENT_CLASS).classes(popperClass)).toBe(true);
    });

    test('arrow', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            arrow: true,
        });
        expect(wrapper.find(ARROW_CLASS).exists()).toBe(true);
    });
});
