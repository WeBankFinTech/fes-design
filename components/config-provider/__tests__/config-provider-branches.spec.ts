import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import ConfigProvider from '../configProvider';
import { useLocale } from '../useLocale';

const mountConsumer = async () => {
    let captured: any = null;
    const Consumer = defineComponent({
        setup() {
            captured = useLocale();
            return () => h('div');
        },
    });
    const wrapper = mount(defineComponent({
        setup() {
            return () =>
                h(ConfigProvider, null, { default: () => h(Consumer) });
        },
    }));
    await nextTick();
    return { wrapper, captured };
};

describe('useLocale 翻译分支补全', () => {
    test('t() 配置项非字符串：告警并返回空串（isString 分支）', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const { wrapper, captured } = await mountConsumer();
        // 'select' 在 locale 中为嵌套对象，非字符串
        expect(captured.t('select')).toBe('');
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('t() 占位符缺省 option：保留原占位符（?? 兜底分支）', async () => {
        const { wrapper, captured } = await mountConsumer();
        // pagination.total = '共 {total} 条'，不传 option → 兜底保留 {total}
        expect(captured.t('pagination.total')).toBe('共 {total} 条');
        // 提供 option 时正常替换
        expect(captured.t('pagination.total', { total: 88 })).toBe('共 88 条');
        expect(captured.lang.value).toBe('zh-cn');
        wrapper.unmount();
    });
});
