import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FModal from '../modal';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('modal');

const wrapper = mount(FModal, {
    attachTo: document.body,
    props: {
        closable: true,
        show: true,
        title: '这是标题',
    },
    slots: {
        default: '这是内容',
    },
});
describe('FModal', () => {
    test('FModal show', async () => {
        await nextTick();
        expect(document.body.querySelector(`.${prefixCls}-body`).textContent).toBe('这是内容');
        await document.body.querySelector(`.${prefixCls}-footer`).firstElementChild.click();
        await document.body.querySelector(`.${prefixCls}-footer`).lastElementChild.click();
        expect(wrapper.emitted()['update:show'][0][0]).toBe(false);
    });

    test('FModal no title', async () => {
        wrapper.setProps({
            title: null,
            show: true,
        });
        await nextTick();
        expect(document.body.querySelector(`.${prefixCls}-header`)).toBeNull();
    });

    test('FModal no close', async () => {
        wrapper.setProps({
            closable: false,
            show: true,
        });
        await nextTick();
        expect(document.body.querySelector(`.${prefixCls}-close`)).toBeNull();
    });

    test('FModal mask closable', async () => {
        wrapper.setProps({
            maskClosable: true,
            show: true,
        });
        await nextTick();
        await document.body.querySelector(`.${prefixCls}-container`).click();
        expect(wrapper.emitted()['update:show'][1][0]).toBe(false);
        wrapper.setProps({
            maskClosable: false,
            show: true,
        });
        await nextTick();
        await document.body.querySelector(`.${prefixCls}-container`).click();
        expect(wrapper.emitted()['update:show'][2]).toBeUndefined();
    });

    test('FModal hide mask', async () => {
        wrapper.setProps({
            mask: false,
            show: true,
        });
        await nextTick();
        expect(document.body.querySelector(`.${prefixCls}-mask`)).toBeNull();
    });
});
