import { mount } from '@vue/test-utils';
import TimePicker from '../time-picker.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const inputPrefixCls = getPrefixCls('input');
const prefixCls = getPrefixCls('time-picker');

// ---------------- TimePicker disabled -------------------
describe('TimePicker disabled', () => {
    test('disabled', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                disabled: true,
            },
        });
        await wrapper.find('input[type="text"]').setValue('11:11:11');
        expect(wrapper.vm.displayValue).toEqual('22:22:22');
    });

    test('disable hours', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                disabledHours() {
                    return ['01'];
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        await wrapper.find('li[data-key="01"]').trigger('click');
        // 隐藏 popper
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('22:22:22');
    });

    test('disable minutes', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                disabledMinutes(hours) {
                    if (hours === '01') {
                        return ['01'];
                    }
                    return [];
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        const allTarget01 = wrapper.findAll('li[data-key="01"]');
        const allTarget02 = wrapper.findAll('li[data-key="02"]');

        await allTarget01[0].trigger('click');
        await allTarget02[1].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:02:22');

        await wrapper.setProps({ open: true });
        await allTarget01[1].trigger('click');
        // 隐藏 popper
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:02:22');
    });

    test('disable seconds', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                disabledSeconds(selectedHour, selectedMinute) {
                    if (selectedHour === '01' && selectedMinute === '01') {
                        return ['01'];
                    }
                    return [];
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        const allTarget01 = wrapper.findAll('li[data-key="01"]');
        const allTarget02 = wrapper.findAll('li[data-key="02"]');

        await allTarget01[0].trigger('click');
        await allTarget01[1].trigger('click');
        await allTarget02[2].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:01:02');

        await wrapper.setProps({ open: true });
        await allTarget01[2].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:01:02');
    });
});

describe('TimePicker clearable', () => {
    test('focus to clearable', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
            },
        });
        await wrapper.find('input[type="text"]').trigger('focus');
        await wrapper.find(`.${inputPrefixCls}-icon`).trigger('click');
        expect(wrapper.vm.displayValue).toEqual('');
    });

    test('not focus to clearable', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
            },
        });
        expect(wrapper.find(`.${inputPrefixCls}-icon`).exists()).toBe(false);
    });
});

describe('TimePicker format', () => {
    test('format: HH:mm', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22',
                format: 'HH:mm',
                appendToContainer: false,
                open: true,
            },
        });
        const allTarget01 = wrapper.findAll('li[data-key="01"]');
        expect(allTarget01.length).toBe(2);

        const hoursLi = wrapper
            .find(`.${prefixCls}-content-item`)
            .findAll('li');
        expect(hoursLi.length).toBe(24);
    });
});

describe('TimePicker step', () => {
    test('hourStep minuteStep secondStep', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                appendToContainer: false,
                hourStep: 2,
                minuteStep: 2,
                secondStep: 4,
                open: true,
            },
        });
        const allItem = wrapper.findAll(`.${prefixCls}-content-item`);
        const hoursLi = allItem[0].findAll('li');
        const minuteLi = allItem[1].findAll('li');
        const secondLi = allItem[2].findAll('li');
        expect(hoursLi.length).toBe(12);
        expect(minuteLi.length).toBe(30);
        expect(secondLi.length).toBe(15);
    });
});
