import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../popper';

// usePopper 分支补全（第二组）：
//  - L56  trigger 不可见（≤1px）守卫 → updateVisible(false)
//  - L128 arrow 中间件分支（jsdom 无布局，真实 floating-ui 恒走 placement
//    翻转提前返回，arrow 分支不可达——与全局 getBoundingClientRect 桩同理，
//    定位数学必须桩；弹层只断可观察样式/事件，不断真实坐标）
//  - L140/L141 arrowX/arrowY 有值/空值两臂
// 定位计算改为可控 mock：放置、arrow 坐标由测试注入，断言真实写入的 style。

const { mockComputePosition } = vi.hoisted(() => ({
    mockComputePosition: vi.fn(),
}));

vi.mock('@floating-ui/dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@floating-ui/dom')>();
    return { ...actual, computePosition: mockComputePosition };
});

const TEST_TRIGGER = 'entry-test-trigger';

afterEach(() => {
    document.body.innerHTML = '';
    mockComputePosition.mockReset();
});

const defaultState = {
    x: 12,
    y: 34,
    placement: 'bottom',
    middlewareData: { arrow: { x: 5, y: 7 } },
    strategy: 'absolute',
    isPositioned: true,
};

const _mount = (props = {}, state = defaultState) => {
    mockComputePosition.mockResolvedValue(state);
    return mount(FPopper, {
        props: { lazy: false, appendToContainer: false, ...props },
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }),
            default: () => h('div', { class: 'entry-content' }, '内容'),
        },
        attachTo: 'body',
    });
};

describe('usePopper 分支补全（入口/守卫/arrow）', () => {
    test('arrow 中间件：写入 left/top 与静态边（arrowX/arrowY 有值）', async () => {
        const wrapper = _mount(
            { arrow: true, modelValue: true, placement: 'bottom' },
            defaultState,
        );
        await nextTick();
        // computePosition mock resolve 后 .then 同步写入 wrapper 定位
        await vi.waitFor(() => {
            const wrapperEl = document.querySelector('.fes-popper-wrapper');
            expect(wrapperEl).not.toBeNull();
            expect((wrapperEl as HTMLElement).style.left).toBe('12px');
            expect((wrapperEl as HTMLElement).style.top).toBe('34px');
        });
        // placement 未翻转（bottom === bottom）→ L128 arrow 分支执行：
        // left/top 取 middlewareData.arrow；静态边 bottom → top: -3px
        const arrowEl = document.querySelector('.fes-popper-arrow');
        expect(arrowEl).not.toBeNull();
        await vi.waitFor(() => {
            expect((arrowEl as HTMLElement).style.left).toBe('5px');
            expect((arrowEl as HTMLElement).style.top).toBe('-3px');
        });
        wrapper.unmount();
    });

    test('arrow 中间件：arrowX/arrowY 为空时赋空串（L140/L141 空值臂）', async () => {
        const wrapper = _mount(
            { arrow: true, modelValue: true, placement: 'bottom' },
            {
                x: 1,
                y: 2,
                placement: 'bottom',
                middlewareData: { arrow: { x: undefined, y: undefined } },
                strategy: 'absolute',
                isPositioned: true,
            },
        );
        await nextTick();
        const arrowEl = document.querySelector('.fes-popper-arrow');
        expect(arrowEl).not.toBeNull();
        await vi.waitFor(() => {
            expect((arrowEl as HTMLElement).style.left).toBe('');
            expect((arrowEl as HTMLElement).style.top).toBe('-3px');
        });
        wrapper.unmount();
    });

    test('trigger 尺寸 ≤1px：computePopper 立即 updateVisible(false)', async () => {
        const wrapper = _mount({ modelValue: true });
        await nextTick();
        const trigger = document.querySelector(`.${TEST_TRIGGER}`);
        expect(trigger).not.toBeNull();
        // 对「当前挂载中的」trigger 桩 0 尺寸（既有用例桩在旧节点上不生效：
        // setProps 重渲染会替换 DOM 节点）→ 再触发重算
        Object.defineProperty(trigger, 'getBoundingClientRect', {
            value: () => {
                const rect = {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                };
                return rect;
            },
            configurable: true,
        });
        (wrapper.vm as any).updatePopperPosition();
        // 守卫命中 → updateVisible(false) → passive 模型 emit update:modelValue false
        await vi.waitFor(() => {
            const evts = wrapper.emitted('update:modelValue');
            expect(evts).toBeTruthy();
            expect(evts![evts!.length - 1][0]).toBe(false);
        });
        wrapper.unmount();
    });

    test('disabled 为函数且返回 true：computePopper 直接跳过定位', async () => {
        const disabledFns = vi.fn(() => true);
        const wrapper = _mount({ modelValue: true, disabled: disabledFns });
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));
        // computePosition 未被调用（disabled 函数守卫拦截 L44-46）
        expect(mockComputePosition).not.toHaveBeenCalled();
        // 弹层未定位（style 无 left/top）/ wrapper 无内容
        const popperEl = document.querySelector('.fes-popper');
        expect(popperEl).not.toBeNull();
        wrapper.unmount();
    });
});
