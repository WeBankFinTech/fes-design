import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import useEsc from '../useEsc';
import { useInput } from '../useInput';

describe('_util/useEsc escClosable 开关', () => {
    test('escClosable=false 不响应 Escape', async () => {
        const calls: Event[] = [];
        const escClosable = ref(false);
        const Comp = defineComponent({
            setup() {
                useEsc((e) => calls.push(e), escClosable);
                return () => h('div');
            },
        });
        mount(Comp);
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape' }),
        );
        expect(calls.length).toBe(0);
        escClosable.value = true;
        await nextTick();
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape' }),
        );
        expect(calls.length).toBe(1);
    });

    test('open=false 时移除监听', async () => {
        const calls: Event[] = [];
        const open = ref(true);
        const Comp = defineComponent({
            setup() {
                useEsc((e) => calls.push(e), ref(true), open);
                return () => h('div');
            },
        });
        mount(Comp);
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(1);
        open.value = false;
        await nextTick();
        await new Promise((r) => setTimeout(r, 10));
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
        expect(calls.length).toBe(1);
    });
});

describe('_util/useInput', () => {
    test('组合输入结束后才更新值', async () => {
        const updates: string[] = [];
        const Comp = defineComponent({
            setup() {
                const { handleInput, handleCompositionStart, handleCompositionEnd } = useInput(
                    (val: string) => updates.push(val),
                );
                return () => h('input', {
                    onInput: handleInput,
                    onCompositionstart: handleCompositionStart,
                    onCompositionend: handleCompositionEnd,
                });
            },
        });
        const wrapper = mount(Comp, { attachTo: document.body });
        const input = wrapper.find('input');
        // 组合输入过程中的 input 不触发更新
        await input.trigger('compositionstart');
        input.element.value = '拼音';
        await input.trigger('input');
        expect(updates).toEqual([]);
        // 组合输入结束触发一次更新
        await input.trigger('compositionend');
        expect(updates).toEqual(['拼音']);
        // 普通 input 直接更新
        input.element.value = '拼音shur';
        await input.trigger('input');
        expect(updates).toEqual(['拼音', '拼音shur']);
        // 字符串直接传入
        wrapper.unmount();
    });
});
