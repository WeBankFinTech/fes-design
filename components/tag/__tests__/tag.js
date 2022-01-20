import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import FTag from '../tag.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('tag');

// ---------------- tag type -------------------

function getTypeWrapper(type) {
    return mount(FTag, {
        props: {
            type,
        },
    });
}

['default', 'success', 'info', 'warning', 'danger'].forEach((type) => {
    test(`tag type ${type}`, () => {
        const wrapper = getTypeWrapper(type);
        const className = `${prefixCls}-type--${type}`;
        expect(wrapper.classes(className)).toBe(true);
    });
});

// ---------------- tag closable -------------------

test('tag closable', async () => {
    const Closable = {
        components: { FTag },
        template: `
            <FTag @close="handleClose">Default</FTag>
            <FTag v-if="visible" @close="handleClose" closable type="success">Success</FTag>
        `,
        data() {
            return {
                visible: true,
            };
        },
        methods: {
            handleClose() {
                this.visible = false;
                this.$emit('close');
            },
        },
    };
    const wrapper = mount(Closable);

    expect(wrapper.find(`.${prefixCls}-type--default`).exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-type--success`).exists()).toBe(true);

    expect(
        wrapper
            .find(`.${prefixCls}-type--default .${prefixCls}__close`)
            .exists(),
    ).toBe(false);
    expect(
        wrapper
            .find(`.${prefixCls}-type--success .${prefixCls}__close`)
            .exists(),
    ).toBe(true);

    wrapper
        .find(`.${prefixCls}-type--success .${prefixCls}__close`)
        .trigger('click');

    await nextTick();

    const closeEvent = wrapper.emitted('close');
    expect(closeEvent).toHaveLength(1);

    expect(wrapper.find(`.${prefixCls}-type--success`).exists()).toBe(false);
});
