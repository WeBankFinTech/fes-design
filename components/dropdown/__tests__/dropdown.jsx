import { mount } from '@vue/test-utils';
import * as popperExports from '@popperjs/core';
import Dropdown from '../dropdown.tsx';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('dropdown');

const SELECTOR = '.fes-popper-wrapper';
const MOUSE_ENTER_EVENT = 'mouseenter';
const MOUSE_LEAVE_EVENT = 'mouseleave';
const CLICK_EVENT = 'click';
const FOCUS_EVENT = 'focus';
const BLUR_EVENT = 'blur';
const TEST_TRIGGER = 'trigger';

const OPTIONS = [
    {
        value: '1',
        label: '删除',
        disabled: true,
    },
    {
        value: '2',
        label: '修改',
    },
    {
        value: '3',
        label: '添加',
    },
    {
        value: '4',
        label: '评论',
    },
    {
        value: '5',
        label: '收藏',
    },
];

jest.useFakeTimers();

const popperMock = jest
    .spyOn(popperExports, 'createPopper')
    .mockImplementation(() => ({
        update: jest.fn(),
        forceUpdate: jest.fn(),
        setOptions: jest.fn(),
        destroy: jest.fn(),
        state: null,
    }));

const _mount = (props = {}) =>
    mount(Dropdown, {
        props,
        slots: {
            default: () => <div class={TEST_TRIGGER}>下拉菜单</div>,
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

describe('Dropdown', () => {
    afterAll(() => {
        popperMock.mockReset();
    });

    beforeEach(() => {
        popperMock.mockClear();
    });

    test('Dropdown default', async () => {
        const wrapper = _mount({
            options: OPTIONS,
        });
        isHide(wrapper);
        const $trigger = wrapper.find(`.${TEST_TRIGGER}`);
        await $trigger.trigger(MOUSE_ENTER_EVENT);
        isShow(wrapper);
        await $trigger.trigger(MOUSE_LEAVE_EVENT);
        isHide(wrapper);
    });
});
