import { mount } from '@vue/test-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

import Input from '../input.vue';

const inputInnerLess = readFileSync(
    join(__dirname, '../style/inputInner.less'),
    'utf-8',
);
const selectTriggerLess = readFileSync(
    join(__dirname, '../../select-trigger/style/index.less'),
    'utf-8',
);
const inputNumberLess = readFileSync(
    join(__dirname, '../../input-number/style/index.less'),
    'utf-8',
);

test('inputInner.less contains &&-size-small rule', () => {
    expect(inputInnerLess).toContain('&&-size-small');
});

test('select-trigger/style/index.less contains &-size-small rule', () => {
    expect(selectTriggerLess).toContain('&-size-small');
});

test('input-number/style/index.less contains &-size-small rule', () => {
    expect(inputNumberLess).toContain('&-size-small');
});

test('FInput with size=small applies f-input-inner-size-small class', () => {
    const wrapper = mount(Input, {
        props: {
            size: 'small',
        },
    });
    const inputInnerElement = wrapper.find('span.fes-input-inner');
    expect(inputInnerElement.exists()).toBe(true);
    const innerClasses = inputInnerElement.classes();
    expect(innerClasses).toContain('fes-input-inner-size-small');
});