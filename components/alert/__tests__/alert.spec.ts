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
