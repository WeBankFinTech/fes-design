import { mount } from '@vue/test-utils';
import Dropdown from '../dropdown.tsx';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('dropdown');

const _mount = (props = {}, slots = {}) =>
    mount(Dropdown, {
        props,
        slots: {
            ...{
                default: () => <span>title</span>,
            },
            ...slots,
        },
    });

describe('Dropdown', () => {
    test('Dropdown vertical', async () => {
        const wrapper = _mount();
    });
});
