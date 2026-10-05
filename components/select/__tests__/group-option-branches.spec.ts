import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FSelectGroupOption from '../groupOption';
import { FOption, FSelect } from '../index';

describe('FSelectGroupOption 父子约束（!parent 分支）', () => {
    test('脱离 FSelect 独立挂载：告警必需搭配 FSelect（孤儿 group 分支）', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // #1031 彻底修复后：孤儿场景熔断空渲染，不再解构 null 抛 TypeError。
        // 此用例原锁定 toThrow 缺陷行为，修复后仅保持「不抛错 + 告警提示」语义。
        expect(() =>
            mount(FSelectGroupOption, { props: { label: '孤儿分组' } }),
        ).not.toThrow();
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

    test('FSelectGroupOption 独立挂载：告警一次 + 空渲染 + 不抛错', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        // #1031 彻底修复：if (!parent) 告警后 return () => null 熔断，
        // 孤儿挂载不再解构 null 抛 TypeError——恰好告警一次、零 error、
        // 空渲染（reactive/provide/注册链路全部跳过）。
        let wrapper: ReturnType<typeof mount> | undefined;
        expect(() => {
            wrapper = mount(FSelectGroupOption, { props: { label: '孤儿分组' } });
        }).not.toThrow();
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).not.toHaveBeenCalled();
        // 空渲染：Vue 对 () => null 的渲染结果是注释占位 <!---->，
        // 即零真实 DOM、零文本；span 包装等正常分支结构完全不存在
        expect(wrapper!.html()).toBe('<!---->');
        expect(wrapper!.find('span').exists()).toBe(false);
        wrapper!.unmount();
        warnSpy.mockRestore();
        errorSpy.mockRestore();
    });
});
