import { mount } from '@vue/test-utils';
import Scrollbar from '../scrollbar.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('scrollbar');
const trackCls = getPrefixCls('scrollbar-track');

// ---------------- TimePicker disabled -------------------
describe('Scrollbar', () => {
    test('height', async () => {
        const wrapper = mount(Scrollbar, {
            props: {
                height: 200,
            },
        });
        const style = wrapper
            .find(`.${prefixCls}-container`)
            .attributes('style');
        expect(style.indexOf('height: 200px') !== -1).toBe(true);

        await wrapper.setProps({ height: '100px' });
        expect(
            wrapper
                .find(`.${prefixCls}-container`)
                .attributes('style')
                .indexOf('height: 100px') !== -1,
        ).toBe(true);
    });

    test('native', async () => {
        const wrapper = mount(Scrollbar, {
            props: {
                height: 200,
            },
        });
        expect(
            wrapper
                .find(`.${prefixCls}-container`)
                .classes(`${prefixCls}-hidden-native-bar`),
        ).toBe(true);
        await wrapper.setProps({ native: true });
        expect(
            wrapper
                .find(`.${prefixCls}-container`)
                .classes(`${prefixCls}-hidden-native-bar`),
        ).toBe(false);
    });

    test('always', async () => {
        const wrapper = mount(Scrollbar, {
            props: {
                height: 200,
            },
        });
        expect(wrapper.find(`.${trackCls}`).attributes('style')).toContain(
            'display: none',
        );
        await wrapper.setProps({ always: true });
        expect(
            wrapper.find(`.${trackCls}`).attributes('style'),
        ).toBeUndefined();
    });
});
