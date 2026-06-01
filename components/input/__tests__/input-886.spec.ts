import { mount } from '@vue/test-utils';

import getPrefixCls from '../../_util/getPrefixCls';
import Input from '../input.vue';

const prefixCls = getPrefixCls('input');

const fs = require('fs');
const path = require('path');

test('inputInner.vue has disabled && !currentValue condition for placeholder', () => {
    const filePath = path.resolve(__dirname, '../inputInner.vue');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('disabled && !currentValue');
});

test('selectTrigger.vue has disabled && unSelectedRef condition for placeholder', () => {
    const filePath = path.resolve(__dirname, '../../select-trigger/selectTrigger.vue');
    const content = fs.readFileSync(filePath, 'utf-8');
    expect(content).toContain('disabled && unSelectedRef');
});

test('input disabled with no value has empty placeholder', () => {
    const wrapper = mount(Input, {
        props: {
            disabled: true,
            placeholder: 'placeholder text',
        },
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('');
});