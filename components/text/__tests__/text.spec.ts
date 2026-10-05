import { mount } from '@vue/test-utils';
import FText from '../text';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('text');

describe('FText', () => {
    test('default render', () => {
        const wrapper = mount(FText, {
            slots: {
                default: () => '文本内容',
            },
        });
        expect(wrapper.element.tagName).toBe('SPAN');
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.classes()).toContain(`${prefixCls}-type--default`);
        expect(wrapper.classes()).toContain(`${prefixCls}-size--middle`);
        expect(wrapper.classes()).not.toContain(`${prefixCls}-text--strong`);
        expect(wrapper.classes()).not.toContain(`${prefixCls}-text--italic`);
        expect(wrapper.classes()).not.toContain(`${prefixCls}-gradient`);
        expect(wrapper.text()).toBe('文本内容');
    });

    test('type prop', () => {
        const types = ['success', 'info', 'warning', 'danger'];
        types.forEach((type) => {
            const wrapper = mount(FText, {
                props: { type },
                slots: {
                    default: () => '文本内容',
                },
            });
            expect(wrapper.classes()).toContain(`${prefixCls}-type--${type}`);
        });
    });

    test('size prop', () => {
        const sizes = ['small', 'large'];
        sizes.forEach((size) => {
            const wrapper = mount(FText, {
                props: { size },
                slots: {
                    default: () => '文本内容',
                },
            });
            expect(wrapper.classes()).toContain(`${prefixCls}-size--${size}`);
        });
    });

    test('strong prop', () => {
        const wrapper = mount(FText, {
            props: { strong: true },
            slots: {
                default: () => '加粗文本',
            },
        });
        expect(wrapper.classes()).toContain(`${prefixCls}-text--strong`);
    });

    test('italic prop', () => {
        const wrapper = mount(FText, {
            props: { italic: true },
            slots: {
                default: () => '斜体文本',
            },
        });
        expect(wrapper.classes()).toContain(`${prefixCls}-text--italic`);
    });

    test('strong and italic together', () => {
        const wrapper = mount(FText, {
            props: { strong: true, italic: true },
        });
        expect(wrapper.classes()).toContain(`${prefixCls}-text--strong`);
        expect(wrapper.classes()).toContain(`${prefixCls}-text--italic`);
    });

    test('tag prop renders custom element', () => {
        const wrapper = mount(FText, {
            props: { tag: 'div' },
            slots: {
                default: () => '文本内容',
            },
        });
        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.text()).toBe('文本内容');
    });

    test('tag mark renders mark element with mark class', () => {
        const wrapper = mount(FText, {
            props: { tag: 'mark' },
            slots: {
                default: () => '标记文本',
            },
        });
        expect(wrapper.element.tagName).toBe('MARK');
        expect(wrapper.classes()).toContain(`${prefixCls}-tag--mark`);
        expect(wrapper.text()).toBe('标记文本');
    });

    test('gradient object renders gradient class and background image', () => {
        const wrapper = mount(FText, {
            props: {
                gradient: { from: 'red', to: 'blue', deg: 90 },
            },
            slots: {
                default: () => '渐变文本',
            },
        });
        expect(wrapper.classes()).toContain(`${prefixCls}-gradient`);
        expect(wrapper.attributes('style')).toContain(
            'linear-gradient(90deg, red, blue)',
        );
    });

    test('gradient object with deg string', () => {
        const wrapper = mount(FText, {
            props: {
                gradient: { from: 'red', to: 'blue', deg: '45deg' },
            },
            slots: {
                default: () => '渐变文本',
            },
        });
        expect(wrapper.attributes('style')).toContain(
            'linear-gradient(45deg, red, blue)',
        );
    });

    test('gradient object without deg uses 0deg', () => {
        const wrapper = mount(FText, {
            props: {
                gradient: { from: 'red', to: 'blue' } as never,
            },
            slots: {
                default: () => '渐变文本',
            },
        });
        expect(wrapper.attributes('style')).toContain(
            'linear-gradient(0deg, red, blue)',
        );
    });

    test('gradient string renders solid color', () => {
        const wrapper = mount(FText, {
            props: {
                gradient: 'red',
            },
            slots: {
                default: () => '纯色文本',
            },
        });
        expect(wrapper.classes()).not.toContain(`${prefixCls}-gradient`);
        expect(wrapper.attributes('style')).toContain('color: red');
    });

    test('incomplete gradient object renders nothing', () => {
        const wrapper = mount(FText, {
            props: {
                // 缺少 to，不认为是合法渐变
                gradient: { from: 'red', to: '' } as never,
            },
            slots: {
                default: () => '普通文本',
            },
        });
        expect(wrapper.classes()).not.toContain(`${prefixCls}-gradient`);
        expect(wrapper.attributes('style')).toBeUndefined();
    });

    test('attrs fallthrough to root element', () => {
        const wrapper = mount(FText, {
            attrs: {
                'id': 'text-id',
                'data-testid': 'text',
            },
            slots: {
                default: () => '文本内容',
            },
        });
        expect(wrapper.attributes('id')).toBe('text-id');
        expect(wrapper.attributes('data-testid')).toBe('text');
    });

    test('click listener falls through to root element', async () => {
        const wrapper = mount(FText, {
            slots: {
                default: () => '文本内容',
            },
        });
        await wrapper.trigger('click');
        // 未声明 emits，监听器透传到根元素，原生 click 事件被记录
        expect(wrapper.emitted('click')).toHaveLength(1);
    });
});
