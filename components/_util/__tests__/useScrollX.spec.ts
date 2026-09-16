import { describe, expect, test, vi } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import useScrollX from '../use/useScrollX';

vi.mock('stickybits', () => {
    const instance = {
        update: vi.fn(),
        cleanup: vi.fn(),
    };
    const mock = vi.fn(() => instance);
    (mock as any).__instance = instance;
    return { default: mock };
});

describe('useScrollX', () => {
    // useScrollX 依赖 onMounted 注册监听，须在组件实例内调用
    const setup = () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const Host = defineComponent({
            setup() {
                const targetRef = ref<HTMLElement>(el);
                const api = useScrollX(targetRef);
                return { ...api, targetRef };
            },
            render() {
                return h('div');
            },
        });
        mount(Host);
        return el;
    };

    test('容器可横向滚动时 wheel 纵向增量转横向滚动', () => {
        const el = setup();
        // 模拟可横向滚动：scrollWidth > offsetWidth
        Object.defineProperty(el, 'offsetWidth', { value: 100 });
        Object.defineProperty(el, 'scrollWidth', { value: 500 });
        // jsdom scrollLeft 可写：0 + deltaY(120) + deltaX(0) = 120
        const evt = new WheelEvent('wheel', {
            deltaY: 120,
            deltaX: 0,
            cancelable: true,
        }) as any;
        const preventDefault = vi.fn();
        evt.preventDefault = preventDefault;
        el.dispatchEvent(evt);
        expect(el.scrollLeft).toBe(120);
        expect(preventDefault).toHaveBeenCalledTimes(1);
        el.remove();
    });

    test('不可横向滚动时 wheel 不改 scrollLeft', () => {
        const el = setup();
        Object.defineProperty(el, 'offsetWidth', { value: 500 });
        Object.defineProperty(el, 'scrollWidth', { value: 500 });
        el.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 120 }) as any,
        );
        expect(el.scrollLeft).toBe(0);
        el.remove();
    });

    test('deltaY 为 0 时不处理', () => {
        const el = setup();
        Object.defineProperty(el, 'offsetWidth', { value: 100 });
        Object.defineProperty(el, 'scrollWidth', { value: 500 });
        el.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 0, deltaX: 50 }) as any,
        );
        expect(el.scrollLeft).toBe(0);
        el.remove();
    });

    test('scrollTo 委托目标元素', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const scrollToSpy = vi.fn();
        el.scrollTo = scrollToSpy as any;
        const targetRef = ref<HTMLElement>(el);
        const { scrollTo } = useScrollX(targetRef);
        scrollTo({ left: 50 });
        expect(scrollToSpy).toHaveBeenCalledWith({ left: 50 });
        el.remove();
    });

    test('卸载时移除 wheel 监听', () => {
        const el = document.createElement('div');
        document.body.appendChild(el);
        const Host = defineComponent({
            setup() {
                useScrollX(ref<HTMLElement>(el));
                return () => h('div');
            },
        });
        const wrapper = mount(Host);
        const removeSpy = vi.spyOn(el, 'removeEventListener');
        wrapper.unmount();
        // onBeforeUnmount 精确解绑 wheel
        expect(removeSpy).toHaveBeenCalledWith('wheel', expect.any(Function));
        el.remove();
    });
});
