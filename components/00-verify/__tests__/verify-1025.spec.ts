/**
 * Issue #1025 [API] Tabs 的 closable/addable 在非 card 类型下静默失效
 *
 * 修复内容（tabs.tsx setup）：
 * 非 card 类型配置 closable/addable 时 console.warn 提示
 * 「仅在 type="card" 下生效」；渲染行为保持不变（仍不渲染关闭/新增按钮）。
 * card 类型行为完全不变、无警告。
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FTabPane, FTabs } from '../../tabs/index';
import { wait } from '../../_util/__tests__/helpers';

const mountTabs = (props: Record<string, unknown> = {}) =>
    mount(FTabs, {
        props,
        slots: {
            default: () => [
                h(FTabPane, { key: 1, value: 'a', label: '标签1' }, () => '内容1'),
                h(FTabPane, { key: 2, value: 'b', label: '标签2' }, () => '内容2'),
            ],
        },
        attachTo: document.body,
    });

describe('#1025 非 card 类型下 closable/addable 告警提示（回归）', () => {
    let warnings: string[] = [];
    let warnSpy: ReturnType<typeof vi.spyOn> | null = null;

    beforeEach(() => {
        warnings = [];
        warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation((...args) => {
                warnings.push(args.map(String).join(' '));
            });
    });

    afterEach(() => {
        warnSpy?.mockRestore();
        document.body.innerHTML = '';
    });

    test('默认 type(line) + closable: true → 不渲染关闭按钮且告警提示', async () => {
        // 不传 type → 默认 'line'
        const wrapper = mountTabs({ closable: true, modelValue: 'a' });
        await nextTick();
        await wait();

        // 渲染行为不变：关闭按钮仍不渲染
        expect(wrapper.findAll('.fes-tabs-tab-close').length).toBe(0);
        // 修复后：有告警提示（修复前静默失效）
        expect(
            warnings.some((w) => w.includes('closable/addable')
                && w.includes('card')),
        ).toBe(true);

        wrapper.unmount();
    });

    test('默认 type(line) + addable: true → 不渲染新增按钮且告警提示', async () => {
        const wrapper = mountTabs({ addable: true, modelValue: 'a' });
        await nextTick();
        await wait();

        // 渲染行为不变：新增按钮仍不渲染
        expect(wrapper.find('.fes-tabs-tab.addable').exists()).toBe(false);
        // 修复后：有告警提示
        expect(
            warnings.some((w) => w.includes('closable/addable')
                && w.includes('card')),
        ).toBe(true);

        wrapper.unmount();
    });

    test('line 类型未配置 closable/addable → 无告警', async () => {
        const wrapper = mountTabs({ modelValue: 'a' });
        await nextTick();
        await wait();

        // 正常用法不告警
        expect(warnings).toHaveLength(0);

        wrapper.unmount();
    });

    test('对照组：type=card + closable/addable → 均正常渲染且无告警', async () => {
        const wrapper = mountTabs({
            type: 'card',
            closable: true,
            addable: true,
            modelValue: 'a',
        });
        await nextTick();
        await wait();

        expect(wrapper.findAll('.fes-tabs-tab-close').length).toBe(2);
        expect(wrapper.find('.fes-tabs-tab.addable').exists()).toBe(true);
        // card 类型不告警
        expect(warnings).toHaveLength(0);

        wrapper.unmount();
    });
});
