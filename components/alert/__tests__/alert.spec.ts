import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FAlert from '../alert';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('alert');

describe('FAlert', () => {
    test('FAlert type default', async () => {
        const wrapper = mount(FAlert, {
            props: {
                message: '常规信息提示内容',
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-info`).text()).toBe(
            '常规信息提示内容',
        );
    });

    test('FAlert type 枚举渲染对应类名', async () => {
        for (const type of ['success', 'warning', 'error'] as const) {
            const wrapper = mount(FAlert, {
                props: { type, message: '内容' },
            });
            await nextTick();
            expect(wrapper.find(`.${prefixCls}-${type}`).exists()).toBe(true);
            wrapper.unmount();
        }
    });

    test('FAlert showIcon 渲染图标；有 description 时 body 带 icon-padding', async () => {
        const plain = mount(FAlert, {
            props: { showIcon: true, message: '内容' },
        });
        await nextTick();
        // 无 description 时无 body 区域，但图标渲染在 head-message-icon
        expect(plain.find(`.${prefixCls}-head-message-icon`).exists()).toBe(true);
        plain.unmount();

        const withDesc = mount(FAlert, {
            props: { showIcon: true, message: '标题', description: '描述' },
        });
        await nextTick();
        expect(withDesc.find(`.${prefixCls}-body`).classes()).toContain(
            `${prefixCls}-icon-padding`,
        );
        withDesc.unmount();
    });

    test('FAlert beforeClose 拒绝时不关闭不触发 close', async () => {
        const wrapper = mount(FAlert, {
            props: {
                closable: true,
                message: '内容',
                beforeClose: () => false,
            },
        });
        await nextTick();
        // onClick 绑在内部图标组件上（非外层 div）
        await wrapper.find(`.${prefixCls}-head-right-close svg`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('close')).toBeUndefined();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('FAlert beforeClose 通过后关闭并触发 close', async () => {
        const wrapper = mount(FAlert, {
            props: {
                closable: true,
                message: '内容',
                beforeClose: () => true,
            },
        });
        await nextTick();
        // onClick 绑在内部图标组件上（非外层 div）
        await wrapper.find(`.${prefixCls}-head-right-close svg`).trigger('click');
        // handleCloseClick 内是 Promise.then 链 + v-if 渲染，需等微任务+渲染
        await new Promise((r) => setTimeout(r, 20));
        expect(wrapper.emitted('close')).toHaveLength(1);
        wrapper.unmount();
    });

    test('FAlert description 渲染描述体', async () => {
        const wrapper = mount(FAlert, {
            props: { message: '标题', description: '描述文本' },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-body`).text()).toContain('描述文本');
        wrapper.unmount();
    });

    test('FAlert action slot 渲染操作区', async () => {
        const wrapper = mount(FAlert, {
            props: { message: '内容' },
            slots: { action: '<button>去处理</button>' },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-head-right`).text()).toContain(
            '去处理',
        );
        wrapper.unmount();
    });

    test('FAlert icon slot 优先于内置图标', async () => {
        const wrapper = mount(FAlert, {
            props: { showIcon: true, message: '内容' },
            slots: { icon: '<i class="custom-icon" />' },
        });
        await nextTick();
        expect(wrapper.find('.custom-icon').exists()).toBe(true);
        wrapper.unmount();
    });

    test('FAlert closable', async () => {
        const wrapper = mount(FAlert, {
            props: {
                closable: true,
                message: '常规信息提示内容',
            },
        });
        await nextTick();
        await wrapper
            .find(`.${prefixCls}-head-right-close span`)
            .trigger('click');
        expect(wrapper.findAll(`.${prefixCls}-info`).length).toBe(0);
    });
});
