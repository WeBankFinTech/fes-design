import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, test } from 'vitest';
import FTag from '../tag.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('tag');

describe('FTag 分支补全（icon 插槽与点击/关闭事件）', () => {
    test('icon 插槽渲染在默认内容之前（$slots.icon 分支，模板 3 行）', () => {
        const wrapper = mount(FTag, {
            slots: {
                icon: () => h('i', { class: 'my-icon' }, '★'),
                default: () => '标签文本',
            },
        });
        const icon = wrapper.find('.my-icon');
        expect(icon.exists()).toBe(true);
        expect(icon.text()).toBe('★');
        // icon 在内容前
        const html = wrapper.find(`.${prefixCls}`).element.innerHTML;
        expect(html.indexOf('my-icon')).toBeLessThan(
            html.indexOf('标签文本'),
        );
        // 未传 icon 插槽时不渲染（分支 false 路径对照）
        const plain = mount(FTag, { slots: { default: () => '无图标' } });
        expect(plain.find('.my-icon').exists()).toBe(false);
        expect(plain.text()).toContain('无图标');
        plain.unmount();
        wrapper.unmount();
    });

    test('点击 tag 触发 click 事件且参数为原生 MouseEvent', async () => {
        const wrapper = mount(FTag, { slots: { default: () => '可点击' } });
        await wrapper.find(`.${prefixCls}`).trigger('click');
        const emitted = wrapper.emitted('click');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toBeInstanceOf(Event);
        wrapper.unmount();
    });

    test('closable 渲染双态关闭图标，点击触发 close 且不冒泡为 click', async () => {
        const wrapper = mount(FTag, {
            props: { closable: true },
            slots: { default: () => '可关闭' },
        });
        const close = wrapper.find(`.${prefixCls}__close`);
        expect(close.exists()).toBe(true);
        // 双态图标：outlined 常显、filled hover 态
        expect(close.find('.outlined').exists()).toBe(true);
        expect(close.find('.filled').exists()).toBe(true);

        // 点击关闭图标：触发 close；@click.stop 拦截冒泡，不再触发 tag 的 click
        await close.find('.outlined').trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
        expect(wrapper.emitted('close')![0][0]).toBeInstanceOf(Event);
        expect(wrapper.emitted('click')).toBeUndefined();
        wrapper.unmount();
    });

    test('非 closable 时不渲染关闭区（v-if false 路径）', () => {
        const wrapper = mount(FTag, { slots: { default: () => '普通' } });
        expect(wrapper.find(`.${prefixCls}__close`).exists()).toBe(false);
        expect(wrapper.emitted('close')).toBeUndefined();
        wrapper.unmount();
    });

    test('type/size/effect 未传与传入时类名分支切换（模板 2 行 classes 三元组）', async () => {
        const wrapper = mount(FTag, { slots: { default: () => 'tag' } });
        // 默认 props 有值：default/middle/light 三类全渲染
        expect(wrapper.classes()).toContain(`${prefixCls}-type--default`);
        expect(wrapper.classes()).toContain(`${prefixCls}-size--middle`);
        expect(wrapper.classes()).toContain(`${prefixCls}-effect--light`);

        await wrapper.setProps({ type: 'success', size: 'small', effect: 'dark' });
        expect(wrapper.classes()).toContain(`${prefixCls}-type--success`);
        expect(wrapper.classes()).not.toContain(`${prefixCls}-type--default`);
        expect(wrapper.classes()).toContain(`${prefixCls}-size--small`);
        expect(wrapper.classes()).toContain(`${prefixCls}-effect--dark`);
        wrapper.unmount();
    });

    test('backgroundColor 空串与有值的 style 分支', async () => {
        const wrapper = mount(FTag, { slots: { default: () => 'tag' } });
        // 默认空串：style 不含背景色
        expect(wrapper.find(`.${prefixCls}`).attributes('style') || '').toBe(
            '',
        );
        await wrapper.setProps({ backgroundColor: 'rgb(1, 2, 3)' });
        expect(
            wrapper.find(`.${prefixCls}`).attributes('style'),
        ).toContain('background-color: rgb(1, 2, 3)');
        wrapper.unmount();
    });
});
