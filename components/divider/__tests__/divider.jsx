import { mount } from '@vue/test-utils';
import Divider from '../divider.tsx';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('divider');

const _mount = (props = {}, slots = {}) =>
    mount(Divider, {
        props,
        slots: {
            ...{
                default: () => <span>title</span>,
            },
            ...slots,
        },
    });

describe('FDivider', () => {
    test('FDivider vertical', async () => {
        const wrapper = _mount();
        expect(wrapper.classes(prefixCls)).toBe(true);
        expect(wrapper.classes('is-vertical')).toBe(false);
        await wrapper.setProps({
            vertical: true,
        });
        expect(wrapper.classes('is-vertical')).toBe(true);
    });

    ['center', 'left', 'right'].forEach((titlePlacement) => {
        test(`FDivider titlePlacement ${titlePlacement}`, () => {
            const wrapper = _mount({
                titlePlacement: titlePlacement,
            });
            expect(
                wrapper
                    .find(`.${prefixCls}-text`)
                    .classes(`is-${titlePlacement}`),
            ).toBe(true);
        });
    });
});
