import { mount } from '@vue/test-utils';
import { h } from 'vue';
import FTextHighlight from '../text-highlight';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('text-highlight');
const highlightSelector = '.highlight';

const getMarkTexts = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('mark').map((mark) => mark.text());

describe('FTextHighlight', () => {
    test('default render with root class and plain text', () => {
        const wrapper = mount(FTextHighlight, {
            slots: {
                default: () => '普通文本内容',
            },
        });
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.text()).toBe('普通文本内容');
        expect(wrapper.findAll('mark')).toHaveLength(0);
    });

    test('single search value highlights matched keyword', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['关键字'],
            },
            slots: {
                default: () => '包含关键字的一句话',
            },
        });
        const marks = wrapper.findAll('mark');
        expect(marks).toHaveLength(1);
        expect(marks[0].text()).toBe('关键字');
        expect(wrapper.text()).toBe('包含关键字的一句话');
        expect(marks[0].classes()).toContain('highlight');
    });

    test('no match leaves text plain', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['不存在的词'],
            },
            slots: {
                default: () => '普通文本内容',
            },
        });
        expect(wrapper.findAll('mark')).toHaveLength(0);
        expect(wrapper.text()).toBe('普通文本内容');
    });

    test('empty searchValues renders plain text', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: [],
            },
            slots: {
                default: () => '普通文本内容',
            },
        });
        expect(wrapper.findAll('mark')).toHaveLength(0);
        expect(wrapper.text()).toBe('普通文本内容');
    });

    test('multiple search values highlight all keywords', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['苹果', '香蕉'],
            },
            slots: {
                default: () => '苹果和香蕉都是水果',
            },
        });
        const marks = wrapper.findAll('mark');
        expect(marks).toHaveLength(2);
        expect(marks[0].text()).toBe('苹果');
        expect(marks[1].text()).toBe('香蕉');
        expect(wrapper.text()).toBe('苹果和香蕉都是水果');
    });

    test('case insensitive by default', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['vue'],
            },
            slots: {
                default: () => 'Vue is great, VUE is great too',
            },
        });
        const marks = wrapper.findAll('mark');
        expect(marks).toHaveLength(2);
        expect(marks[0].text()).toBe('Vue');
        expect(marks[1].text()).toBe('VUE');
    });

    test('strict mode is case sensitive', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['Vue'],
                strict: true,
            },
            slots: {
                default: () => 'Vue vue VUE vue',
            },
        });
        const marks = wrapper.findAll('mark');
        // 严格模式下只命中大小写完全一致的 'Vue'
        expect(marks).toHaveLength(1);
        expect(marks[0].text()).toBe('Vue');
    });

    test('multiple occurrences of same keyword are all highlighted', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['好'],
            },
            slots: {
                default: () => '你好，好很好的好',
            },
        });
        expect(wrapper.findAll('mark')).toHaveLength(4);
        expect(wrapper.text()).toBe('你好，好很好的好');
    });

    test('highlight uses mark element with FText', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['高亮'],
            },
            slots: {
                default: () => '高亮我',
            },
        });
        const mark = wrapper.find('mark');
        expect(mark.exists()).toBe(true);
        expect(mark.classes()).toContain('highlight');
        expect(mark.classes()).toContain(getPrefixCls('text'));
        expect(mark.text()).toBe('高亮');
    });

    test('markTextStyle is applied to highlighted mark', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['红字'],
                markTextStyle: { color: 'red' },
            },
            slots: {
                default: () => '红字内容',
            },
        });
        expect(wrapper.find('mark').attributes('style')).toContain('red');
    });

    test('keyword inside child element is highlighted', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['嵌套'],
            },
            slots: {
                default: () => h('p', '段落中嵌套的词'),
            },
        });
        const p = wrapper.find('p');
        expect(p.exists()).toBe(true);
        const mark = p.find('mark');
        expect(mark.exists()).toBe(true);
        expect(mark.text()).toBe('嵌套');
        expect(p.text()).toBe('段落中嵌套的词');
    });

    test('multiple root text nodes and child elements', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['命中'],
            },
            slots: {
                default: () => [
                    h('b', '命中加粗'),
                    '直接命中文本',
                    h('i', '其他内容'),
                ],
            },
        });
        const marks = wrapper.findAll('mark');
        expect(marks).toHaveLength(2);
        expect(getMarkTexts(wrapper)).toEqual(['命中', '命中']);
        expect(wrapper.text()).toBe('命中加粗直接命中文本其他内容');
        expect(wrapper.find('b').exists()).toBe(true);
        expect(wrapper.find('i').exists()).toBe(true);
    });

    test('highlight class selector works', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['词'],
            },
            slots: {
                default: () => '一个词',
            },
        });
        expect(wrapper.find(highlightSelector).exists()).toBe(true);
        expect(wrapper.find(highlightSelector).text()).toBe('词');
    });
});
