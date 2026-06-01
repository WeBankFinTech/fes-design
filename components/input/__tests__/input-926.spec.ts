import { mount } from '@vue/test-utils';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import getPrefixCls from '../../_util/getPrefixCls';
import Input from '../input.vue';

const prefixCls = getPrefixCls('input');
const inputInnerPrefixCls = getPrefixCls('input-inner');

function getInputInnerLess(): string {
    return readFileSync(
        resolve(__dirname, '../style/inputInner.less'),
        'utf-8',
    );
}

test('inputInner.less has vertical-align: middle for both prefix and suffix', () => {
    const lessContent = getInputInnerLess();
    const prefixMatch = lessContent.match(/&\-prefix\s*\{[^}]*vertical-align\s*:\s*middle/);
    const suffixMatch = lessContent.match(/&\-suffix\s*\{[^}]*vertical-align\s*:\s*middle/);
    expect(prefixMatch).not.toBeNull();
    expect(suffixMatch).not.toBeNull();
});

test('FInput with prefix and suffix slots mounts without error', () => {
    expect(() =>
        mount(Input, {
            props: {
                modelValue: 'test',
            },
            slots: {
                prefix: 'PREFIX',
                suffix: 'SUFFIX',
            },
        }),
    ).not.toThrow();
    const wrapper = mount(Input, {
        props: {
            modelValue: '',
        },
        slots: {
            prefix: 'PREFIX',
            suffix: 'SUFFIX',
        },
    });
    expect(wrapper.find(`.${inputInnerPrefixCls}-prefix`).exists()).toBe(true);
    expect(wrapper.find(`.${inputInnerPrefixCls}-suffix`).exists()).toBe(true);
});