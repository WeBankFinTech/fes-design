import { mount } from '@vue/test-utils';
import Button from '../button';
import getPrefixCls from '../../_util/getPrefixCls';
import { sleep } from '../../_util/utils';

const prefixCls = getPrefixCls('btn');

// ---------------- button type ut -------------------

function getTypeWrapper(type) {
    return mount(Button, {
        props: {
            type,
        },
    });
}

[
    'default',
    'primary',
    'link',
    'text',
    'info',
    'success',
    'warning',
    'danger',
].forEach((type) => {
    test(`button type ${type}`, () => {
        const wrapper = getTypeWrapper(type);
        const className = `${prefixCls}-type-${type}`;
        expect(wrapper.classes(className)).toBe(true);
    });
});

// ---------------- button disabled -------------------

test('button disabled', async () => {
    const Counter = {
        components: { Button },
        template: '<Button @click="handleClick" disabled>Increment</Button>',
        data() {
            return {
                count: 0,
            };
        },
        methods: {
            handleClick() {
                this.count += 1;
                this.$emit('increment', this.count);
            },
        },
    };
    const wrapper = mount(Counter);
    expect(wrapper.attributes('disabled')).toEqual('');
    wrapper.find('button').trigger('click');
    await sleep(10);
    const incrementEvent = wrapper.emitted('increment');
    // eslint-disable-next-line
    expect(incrementEvent).toBe(undefined);
});

// ---------------- button blocks -------------------

test('button long', () => {
    const wrapper = mount(Button, {
        props: {
            long: true,
        },
    });
    const className = `${prefixCls}-long`;
    expect(wrapper.classes(className)).toBe(true);
});

// ---------------- button loading -------------------

test('button loading', () => {
    const wrapper = mount(Button, {
        props: {
            loading: true,
        },
    });
    const className = `.${prefixCls}-loading-icon`;
    expect(wrapper.find(className).exists()).toBe(true);
    expect(wrapper.classes('is-loading')).toBe(true);
});

test('button loading async', async () => {
    const wrapper = mount(Button, {
        props: {},
    });
    const className = `.${prefixCls}-loading-icon`;
    expect(wrapper.find(className).exists()).toBe(false);
    expect(wrapper.classes('is-loading')).toBe(false);
    await sleep(10);
    wrapper.setProps({ loading: true });
    await sleep(10);
    expect(wrapper.find(className).exists()).toBe(true);
    expect(wrapper.classes('is-loading')).toBe(true);
});

// ---------------- button throttle -------------------

test('button throttle 300', async () => {
    const Counter = {
        components: { Button },
        template:
            '<Button @click="handleClick" :throttle="300">Increment</Button>',
        data() {
            return {
                count: 0,
            };
        },
        methods: {
            handleClick() {
                this.count += 1;
                this.$emit('increment', this.count);
            },
        },
    };

    const wrapper = mount(Counter);

    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');
    await sleep(400);
    await wrapper.find('button').trigger('click');

    const incrementEvent = wrapper.emitted('increment');
    expect(incrementEvent).toHaveLength(2);

    expect(incrementEvent[0]).toEqual([1]);
    expect(incrementEvent[1]).toEqual([2]);
});
