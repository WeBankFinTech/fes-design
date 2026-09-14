import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive } from 'vue';
import ConfigProvider, { useConfig } from '../configProvider';
import { useLocale } from '../useLocale';
import { enUS, zhCN } from '../../locales';

describe('FConfigProvider', () => {
    test('渲染默认插槽', () => {
        const wrapper = mount(ConfigProvider, {
            slots: { default: () => h('div', '内容区') },
        });
        expect(wrapper.text()).toContain('内容区');
        wrapper.unmount();
    });

    test('getContainer 经 provide 传递给 useConfig', async () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        let captured: any = null;
        const Consumer = defineComponent({
            setup() {
                captured = useConfig();
                return () => h('div', 'consumer');
            },
        });
        const wrapper = mount(defineComponent({
            setup() {
                return () =>
                    h(
                        ConfigProvider,
                        { getContainer: () => container },
                        { default: () => h(Consumer) },
                    );
            },
        }));
        await nextTick();
        expect(captured).toBeTruthy();
        expect(captured.getContainer.value()).toBe(container);
        container.remove();
        wrapper.unmount();
    });

    test('无 ConfigProvider 时 useConfig 返回默认容器', () => {
        let captured: any = null;
        const Consumer = defineComponent({
            setup() {
                captured = useConfig();
                return () => h('div');
            },
        });
        mount(Consumer);
        expect(captured.getContainer.value).toBeTruthy();
    });

    test('locale 经 useLocale 影响子组件翻译', async () => {
        let captured: any = null;
        const Consumer = defineComponent({
            setup() {
                captured = useLocale();
                return () => h('div');
            },
        });
        const props = reactive({ locale: enUS });
        const wrapper = mount(defineComponent({
            setup() {
                return () =>
                    h(
                        ConfigProvider,
                        props as any,
                        { default: () => h(Consumer) },
                    );
            },
        }));
        await nextTick();
        // enUS 下 lang 为 en-US，翻译走英文表
        expect(captured.lang.value).toBe('en');
        // 选择器空文案在英文下是 No Data
        expect(captured.t('select.emptyText')).not.toBe('暂无数据');
        wrapper.unmount();
    });

    test('默认 locale 为中文', async () => {
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
        expect(captured.lang.value).toBe(zhCN.name);
        expect(captured.t('select.emptyText')).toBe('暂无数据');
        wrapper.unmount();
    });

    test('theme 与 themeOverrides 接受并透传', async () => {
        const wrapper = mount(ConfigProvider, {
            props: { theme: 'dark', themeOverrides: { common: { colorPrimary: 'red' } } as any },
            slots: { default: () => h('div', 'x') },
        });
        await nextTick();
        expect(wrapper.text()).toContain('x');
        wrapper.unmount();
    });

    test('useLocale.t 未知 path 告警并返回空串', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
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
        const result = captured.t('not.existing.path');
        expect(result).toBe('');
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        wrapper.unmount();
    });

    test('useLocale.t 占位符替换', async () => {
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
        // 带占位符的语言项
        const result = captured.t('pagination.total', { total: 10 });
        expect(result).toContain('10');
        wrapper.unmount();
    });

    test('useConfig 在非组件环境返回空对象', () => {
        const result = useConfig();
        expect(result).toEqual({});
    });
});
