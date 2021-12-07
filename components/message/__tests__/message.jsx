import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Message from '..';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('alert');

let wrapper;

async function initWrapper() {
    if (wrapper) return;
    wrapper = await mount({ template: '<div></div>' }, {});
    Message.config({
        getContainer: () => wrapper.element,
    });
}

describe('Message', () => {
    test('Message.info', async () => {
        await initWrapper();
        await Message.info('message');
        await nextTick();
        expect(wrapper.text()).toBe('message');
    });

    test('Message closable', async () => {
        await initWrapper();
        const afterClose = jest.fn(() => true);
        await Message.info({
            closable: true,
            content: 'message',
            afterClose,
        });
        await nextTick();
        await wrapper.find(`.${prefixCls}-head-right-close span`).trigger('click');
        expect(afterClose.mock.calls.length).toBe(1);
    });
});
