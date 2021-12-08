import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tabs from '../tabs';
import TabPane from '../tab-pane';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('tabs');

const tabs = [
    { name: 'Tab 1', value: 1 },
    { name: 'Tab 2', value: 2 },
    { name: 'Tab 3', value: 3 },
];

describe('Tabs', () => {
    test('Tabs tab click', async () => {
        const wrapper = mount(Tabs, {
            props: {
                modelValue: 1,
            },
            slots: {
                default: () => tabs.map(item => <TabPane {...item}>{item.value}</TabPane>),
            },
        });
        await nextTick();
        const tabList = wrapper.findAll(`.${prefixCls}-tab`);
        let tabPane = wrapper.find(`.${prefixCls}-tab-pane`);
        expect(tabPane.text()).toBe('1');
        expect(tabList[0].text()).toBe('Tab 1');
        await tabList[2].trigger('click');
        tabPane = wrapper.find(`.${prefixCls}-tab-pane`);
        expect(tabPane.text()).toBe('3');
        expect(tabList[2].text()).toBe('Tab 3');
        expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(3);
    });
});

describe('Tabs', () => {
    test('Tabs tab disabled click', async () => {
        tabs[2].disabled = true;
        const wrapper = mount(Tabs, {
            props: {
                modelValue: 1,
            },
            slots: {
                default: () => tabs.map(item => <TabPane {...item}>{item.value}</TabPane>),
            },
        });
        await nextTick();
        const tabList = wrapper.findAll(`.${prefixCls}-tab`);
        await tabList[2].trigger('click');
        expect(tabList[2].text()).toBe('Tab 3');
        expect(wrapper.emitted()['update:modelValue']).toBeUndefined();
    });
});

describe('Tabs', () => {
    test('Tabs tab card style', async () => {
        const wrapper = mount(Tabs, {
            props: {
                modelValue: 1,
                type: 'card',
            },
            slots: {
                default: () => tabs.map(item => <TabPane {...item}>{item.value}</TabPane>),
            },
        });
        await nextTick();
        const tabList = wrapper.findAll(`.${prefixCls}-tab-card`);
        expect(tabList.length).toBe(3);
    });
});

describe('Tabs', () => {
    test('Tabs tab card close click', async () => {
        tabs[1].closable = true;
        const wrapper = mount(Tabs, {
            props: {
                modelValue: 1,
                type: 'card',
            },
            slots: {
                default: () => tabs.map(item => <TabPane {...item}>{item.value}</TabPane>),
            },
        });
        await nextTick();
        const tabList = wrapper.findAll(`.${prefixCls}-tab`);
        await tabList[1].find(`.${prefixCls}-tab-close span`).trigger('click');
        expect(wrapper.emitted().close[0][0]).toBe(2);
    });
});
