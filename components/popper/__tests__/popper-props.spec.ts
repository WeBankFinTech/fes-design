import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../popper';
import { sleep } from '../../_util/utils';

const TEST_TRIGGER = 'test-trigger';
const AXIOM = 'Rem is the best girl';
const CONTENT_CLASS = '.fes-popper';

const Wrapped = (props, { slots }) => h('div', h(FPopper, props, slots));

const _mount = (props, slots = {}) =>
    mount(Wrapped, {
        props,
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }),
            ...slots,
        },
        attachTo: 'body',
        global: { stubs: { transition: false } },
    });

describe('FPopper 属性补全', () => {
    // placement → transitionName 枚举穷举（技能：placement 枚举断言）
    // MAP: bottom→up / top→down / left→right / right→left
    const CASES: [string, string][] = [
        ['bottom', 'up'],
        ['bottom-start', 'up'],
        ['bottom-end', 'up'],
        ['top', 'down'],
        ['top-start', 'down'],
        ['top-end', 'down'],
        ['left', 'right'],
        ['left-start', 'right'],
        ['left-end', 'right'],
        ['right', 'left'],
        ['right-start', 'left'],
        ['right-end', 'left'],
    ];
    test.each(CASES)(
        'placement=%s 动画 fes-slide-%s',
        async (placement, expectedSlide) => {
            const wrapper = _mount(
                { lazy: false, appendToContainer: false, placement },
                { default: () => AXIOM },
            );
            await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
            await nextTick();
            // enter 瞬间 content 带 fes-slide-{dir}-enter-active 类（Transition name 落地）
            const cls = String(wrapper.find(CONTENT_CLASS).attributes('class'));
            expect(cls).toContain(`fes-slide-${expectedSlide}-enter-active`);
            wrapper.unmount();
        },
    );

    test('offset 偏移不报错且正常渲染', async () => {
        const wrapper = _mount(
            { lazy: false, appendToContainer: false, offset: 12 },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        wrapper.unmount();
    });

    test('showAfter 延迟显示', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                showAfter: 100,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        // 未到延迟时间，先不显示
        await sleep(30);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        await sleep(120);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        wrapper.unmount();
    });

    test('hideAfter 延迟隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                hideAfter: 100,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        // 延迟隐藏期间仍可见
        await sleep(30);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        // 留足裕量：100ms hideAfter + leave 动画，负载下 120ms 偶发不够
        await sleep(400);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        wrapper.unmount();
    });

    test('popperClass 自定义类名', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                popperClass: 'my-popper',
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find('.my-popper').exists()).toBe(true);
        wrapper.unmount();
    });

    test('arrow=false 不渲染箭头', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                arrow: false,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find('.fes-popper-arrow').exists()).toBe(false);
        wrapper.unmount();
    });

    test('disabled 禁用后不显示', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                disabled: true,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        wrapper.unmount();
    });

    test('onlyShowTrigger 显示后不隐藏（含废弃告警）', async () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                onlyShowTrigger: true,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        // 移出后不隐藏
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await sleep(50);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        // #1026：onlyShowTrigger 已废弃，提示改用 keepVisible（行为保持等价）
        expect(
            warnSpy.mock.calls.some((args) =>
                String(args[0]).includes('onlyShowTrigger')
                && String(args[0]).includes('keepVisible'),
            ),
        ).toBe(true);
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('#1026 keepVisible 与 onlyShowTrigger 等价：显示后不隐藏且无废弃告警', async () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                keepVisible: true,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        // 移出后不隐藏（与 onlyShowTrigger 行为一致）
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await sleep(50);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        // keepVisible 是推荐用法，无废弃告警
        expect(
            warnSpy.mock.calls.some((args) =>
                String(args[0]).includes('onlyShowTrigger'),
            ),
        ).toBe(false);
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('#1026 keepVisible/onlyShowTrigger 均未设置时行为不变：显示后正常隐藏', async () => {
        const wrapper = _mount(
            {
                lazy: false,
                appendToContainer: false,
                hideAfter: 100,
            },
            { default: () => AXIOM },
        );
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await sleep(50);
        expect(wrapper.find(CONTENT_CLASS).exists()).toBe(true);
        // 未开启保持可见：移出后正常隐藏（与既有 hideAfter 行为一致）
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseleave');
        await sleep(30);
        expect(
            (wrapper.find(CONTENT_CLASS).attributes('style') || '').includes(
                'display: none',
            ),
        ).toBe(false);
        await sleep(200);
        expect(
            wrapper.find(CONTENT_CLASS).attributes('style') || '',
        ).toContain('display: none');
        wrapper.unmount();
    });
});
