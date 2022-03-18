import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import * as popperExports from '@popperjs/core';
import FPopper from '../popper';
import PopupManager from '../../_util/popupManager';

jest.useFakeTimers();

const TEST_TRIGGER = 'test-trigger';
const AXIOM = 'Rem is the best girl';
const SELECTOR = '.fes-popper';
const DISPLAY_NONE = 'display: none';
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

const isHide = (wrapper) => {
    expect(wrapper.find(SELECTOR).attributes('style')).toContain(DISPLAY_NONE);
};

const isShow = (wrapper) => {
    expect(wrapper.find(SELECTOR).attributes('style')).not.toContain(
        DISPLAY_NONE,
    );
};

const popperMock = jest
    .spyOn(popperExports, 'createPopper')
    .mockImplementation(() => ({
        update: jest.fn(),
        forceUpdate: jest.fn(),
        setOptions: jest.fn(),
        destroy: jest.fn(),
        state: null,
    }));

describe('Popper', () => {
    afterAll(() => {
        popperMock.mockReset();
    });

    beforeEach(() => {
        popperMock.mockClear();
    });

    test('render test', () => {
        const wrapper = _mount(
            {
                appendToContainer: false,
            },
            {
                default: () => AXIOM,
            },
        );

        expect(wrapper.text()).toEqual(AXIOM);
    });

    test('append to body', () => {
        let wrapper = _mount();
        expect(wrapper.find(SELECTOR).exists()).toBe(false);

        wrapper = _mount({
            appendToContainer: false,
        });

        expect(wrapper.find(SELECTOR).exists()).toBe(true);
    });

    test('popper z-index should be dynamical', () => {
        const wrapper = _mount({
            appendToContainer: false,
        });

        expect(
            Number.parseInt(
                window.getComputedStyle(wrapper.find(SELECTOR).element).zIndex,
            ),
        ).toBeLessThanOrEqual(PopupManager.zIndex);
    });

    test('should show popper when mouse entered and hide when popper left', async () => {
        const wrapper = _mount({
            appendToContainer: false,
            hideAfter: 0,
        });

        isHide(wrapper);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        isShow(wrapper);
        await $trigger.trigger(MOUSE_LEAVE_EVENT);
        isHide(wrapper);
    });

    test('should be able to manual open', async () => {
        const wrapper = _mount({
            appendToContainer: false,
            modelValue: false,
        });
        isHide(wrapper);
        await wrapper.setProps({
            modelValue: true,
        });
        isShow(wrapper);
    });

    test('should disable popper to popup', async () => {
        const wrapper = _mount({
            disabled: true,
            appendToContainer: false,
        });

        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        isHide(wrapper);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        isHide(wrapper);
        await wrapper.setProps({
            disabled: false,
        });
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        isShow(wrapper);
    });

    test('should hide after hide after is given', async () => {
        const wrapper = _mount({
            hideAfter: 200,
            appendToContainer: false,
        });
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        isShow(wrapper);

        await $trigger.trigger(MOUSE_LEAVE_EVENT);
        jest.runOnlyPendingTimers();
        await nextTick();
        isHide(wrapper);
    });

    test('should work with click trigger', async () => {
        const wrapper = _mount({
            trigger: CLICK_EVENT,
            appendToContainer: false,
            hideAfter: 0,
        });
        await nextTick();

        const trigger = wrapper.find(`.${TEST_TRIGGER}`);
        isHide(wrapper);
        // for now triggering event on element via DOMWrapper is not available so we need to apply
        // old way
        await trigger.trigger(CLICK_EVENT);

        isShow(wrapper);

        await trigger.trigger(MOUSE_LEAVE_EVENT);
        isShow(wrapper);

        await wrapper.find(SELECTOR).trigger(MOUSE_LEAVE_EVENT);
        isShow(wrapper);

        await trigger.trigger(BLUR_EVENT);
        isShow(wrapper);

        await trigger.trigger(CLICK_EVENT);
        isHide(wrapper);
    });

    test('should work with hover trigger', async () => {
        const wrapper = _mount({
            trigger: 'hover',
            appendToContainer: false,
            hideAfter: 0,
        });
        await nextTick();

        const trigger = wrapper.find(`.${TEST_TRIGGER}`);
        isHide(wrapper);
        // for now triggering event on element via DOMWrapper is not available so we need to apply
        // old way
        await trigger.trigger(MOUSE_ENTER_EVENT);
        isShow(wrapper);

        await trigger.trigger(BLUR_EVENT);
        isShow(wrapper);

        await trigger.trigger(MOUSE_LEAVE_EVENT);
        isHide(wrapper);

        await trigger.trigger(FOCUS_EVENT);
        isHide(wrapper);

        await trigger.trigger(CLICK_EVENT);
        isHide(wrapper);
    });

    test('should work with focus trigger', async () => {});

    test('should throw error when there is no trigger', async () => {
        const errorHandler = jest.fn();
        mount(Wrapped, {
            slots: {
                trigger: null,
            },
            global: {
                config: {
                    errorHandler(err) {
                        errorHandler(err);
                    },
                    warnHandler() {
                        // suppress warning
                    },
                },
            },
        });
        expect(errorHandler).toHaveBeenCalledTimes(1);
    });

    // test('popperClass', async () => {
    //     const wrapper = _mount({
    //         popperClass: 'popper-class',
    //     });
    //     expect(wrapper.find('.popper-class').exists()).toBe(true);
    // });
});
