import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import * as popperExports from '@popperjs/core';
import FPopper from '../popper';
import PopupManager from '../../_util/popupManager';
import { sleep, rAF } from '../../_util/utils';

const TEST_TRIGGER = 'test-trigger';
const AXIOM = 'Rem is the best girl';
const SELECTOR = '.fes-popper-wrapper';
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
    expect(wrapper.find(SELECTOR).isVisible()).toBe(false);
};

const isShow = (wrapper) => {
    expect(wrapper.find(SELECTOR).isVisible()).toBe(true);
};

const popperMock = jest
    .spyOn(popperExports, 'createPopper')
    .mockImplementation(() => ({
        update: jest.fn(() => {
            return new Promise((resolve) => {
                resolve();
            });
        }),
        forceUpdate: jest.fn(),
        setOptions: jest.fn(),
        destroy: jest.fn(),
        state: null,
    }));

jest.useFakeTimers();

describe('Popper', () => {
    afterAll(() => {
        popperMock.mockReset();
    });

    beforeEach(() => {
        popperMock.mockClear();
    });

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

        expect(wrapper.find(SELECTOR).exists()).toBe(false);

        await wrapper.setProps({
            appendToContainer: false,
        });

        expect(wrapper.find(SELECTOR).exists()).toBe(true);
    });

    test('popper z-index should be dynamical', () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
        });

        expect(
            Number.parseInt(
                window.getComputedStyle(wrapper.find(SELECTOR).element).zIndex,
            ),
        ).toBeLessThanOrEqual(PopupManager.zIndex);
    });

    test('should show popper when mouse entered and hide when popper leave', async () => {
        const wrapper = _mount({
            trigger: 'click',
            lazy: false,
            appendToContainer: false,
        });

        isHide(wrapper);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(CLICK_EVENT);
        jest.runAllTimers();
        await rAF();
        isShow(wrapper);
    });
});
