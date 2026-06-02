import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FModal from '../modal';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('modal');

describe('FModal centered prop (#812)', () => {
    test('centered: true applies the centered class', async () => {
        const wrapper = mount(FModal, {
            attachTo: document.body,
            props: {
                show: true,
                centered: true,
            },
            slots: {
                default: 'content',
            },
        });
        await nextTick();
        const container = document.body.querySelector(`.${prefixCls}-container`);
        expect(container?.classList.contains(`${prefixCls}-centered`)).toBe(true);
        wrapper.unmount();
    });

    test('centered: false (default) does not apply the centered class', async () => {
        const wrapper = mount(FModal, {
            attachTo: document.body,
            props: {
                show: true,
            },
            slots: {
                default: 'content',
            },
        });
        await nextTick();
        const container = document.body.querySelector(`.${prefixCls}-container`);
        expect(container?.classList.contains(`${prefixCls}-centered`)).toBe(false);
        wrapper.unmount();
    });
});