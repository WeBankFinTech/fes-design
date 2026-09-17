import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FSelectGroupOption from '../groupOption';
import { FOption, FSelect } from '../index';

describe('FSelectGroupOption 父子约束（!parent 分支）', () => {
    test('脱离 FSelect 独立挂载：告警必需搭配 FSelect（孤儿 group 分支）', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // 真实行为：inject 到 null → console.warn 提示后，仍继续解构 null 的
        // addOption 导致挂载抛 TypeError（潜在源码缺陷，见回报说明，未改源码）
        expect(() =>
            mount(FSelectGroupOption, { props: { label: '孤儿分组' } }),
        ).toThrow(TypeError);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('FSelectGroupOption'),
        );
        warnSpy.mockRestore();
    });

    test('作为 FSelect 子插槽时正常注册分组（真实父子链路）', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(FSelect, {
            props: { modelValue: '', appendToContainer: false },
            slots: {
                default: () =>
                    h(
                        FSelectGroupOption,
                        { label: '城市组' },
                        () => [h(FOption, { label: '北京', value: 'bj' })],
                    ),
            },
        });
        await nextTick();
        // 有 FSelect 父级：注册链路走正常分支，无孤儿告警
        expect(warnSpy).not.toHaveBeenCalled();
        const select = wrapper.find('.fes-select');
        expect(select.exists()).toBe(true);
        wrapper.unmount();
        warnSpy.mockRestore();
    });
});
