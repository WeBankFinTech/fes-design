import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test } from 'vitest';
import Tooltip from '../tooltip';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('tooltip');

const wrappers = [];
const _mount = (props = {}, slots = {}) => {
    const wrapper = mount(Tooltip, {
        props,
        slots: {
            default: () => h('div', { class: 'test-trigger' }, 'trigger'),
            ...slots,
        },
    });
    wrappers.push(wrapper);
    return wrapper;
};

describe('Tooltip', () => {
    afterEach(() => {
        while (wrappers.length) {
            wrappers.pop().unmount();
        }
    });

    test('content prop 渲染', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            content: 'prop-content',
        });
        await nextTick();
        expect(wrapper.find('.fes-popper').text()).toContain('prop-content');
    });

    test('content slot 优先于 content prop', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                content: 'prop-content',
            },
            {
                content: () =>
                    h('span', { class: 'slot-content' }, 'slot-content'),
            },
        );
        await nextTick();
        const popper = wrapper.find('.fes-popper');
        expect(popper.text()).toContain('slot-content');
        expect(popper.text()).not.toContain('prop-content');
    });

    test('mouse enter 显示、mouse leave 隐藏', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            content: 'hover content',
        });
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);

        await wrapper.find('.test-trigger').trigger('mouseenter');
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(true);

        // 消失时存在 hideAfter 延迟：vi.waitFor 轮询至隐藏
        await wrapper.find('.test-trigger').trigger('mouseleave');
        await vi.waitFor(() => {
            expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
        });
    });

    test('disabled 时不响应 hover', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            disabled: true,
            content: 'disabled content',
        });
        await nextTick();
        await wrapper.find('.test-trigger').trigger('mouseenter');
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);
    });

    test('confirm 模式：点击触发，ok/cancel 按钮回调', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            mode: 'confirm',
            title: 'confirm title',
            content: 'confirm content',
        });
        await nextTick();
        await wrapper.find('.test-trigger').trigger('click');
        await nextTick();

        const header = wrapper.find(`.${prefixCls}-modal-header`);
        expect(header.exists()).toBe(true);
        expect(header.text()).toContain('confirm title');
        expect(header.classes()).toContain('is-confirm');

        const body = wrapper.find(`.${prefixCls}-modal-body`);
        expect(body.exists()).toBe(true);
        expect(body.classes()).toContain('is-confirm');
        expect(body.classes()).toContain('has-header');
        expect(body.text()).toContain('confirm content');

        const btns = wrapper.findAll(`.${prefixCls}-modal-btn`);
        expect(btns.length).toBe(2);

        // 点击确认
        await btns[0].trigger('click');
        expect(wrapper.emitted('ok')).toHaveLength(1);
        await nextTick();
        expect(wrapper.find('.fes-popper').isVisible()).toBe(false);

        // 再次打开后点击取消
        await wrapper.find('.test-trigger').trigger('click');
        await nextTick();
        await wrapper.findAll(`.${prefixCls}-modal-btn`)[1].trigger('click');
        expect(wrapper.emitted('cancel')).toHaveLength(1);
    });
});
