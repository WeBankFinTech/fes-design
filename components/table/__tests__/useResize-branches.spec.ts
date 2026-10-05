import { computed, ref } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import useResize from '../useResize';

/**
 * table/useResize 分支补全（基线 7/10，死分支）：
 * - L53[0] 防御分支：current 已设但 _widthMap 快照缺失时 mousemove 早退
 * - L59[1] isWidthAuto=true 时拖拽只改当前列（width/minWidth/maxWidth 同步）
 * - L84[0] 防御分支：mouseup 时 current 列已不在 columns（动态移除列）早退
 *
 * useResize 是纯 composable（header.tsx 内部调用），直接以单元测试驱动
 * 返回的 onMousedown/onMousemove/onMouseup，断言 widthMap / 事件回报语义。
 */
const makeColumns = () => [
    { id: 1, props: { prop: 'name' } },
    { id: 2, props: { prop: 'age' } },
];

const makeWidthMap = () =>
    ref({
        1: { id: 1, width: 100 },
        2: { id: 2, width: 200 },
    });

const makeEvent = (clientX: number) =>
    ({ clientX }) as MouseEvent;

describe('useResize（列宽拖拽 composable）', () => {
    test('完整拖拽链：mousedown → mousemove 更新宽度 → mouseup 回报句柄', () => {
        const columns = makeColumns() as any;
        const widthMap = makeWidthMap() as any;
        const handleHeaderResize = vi.fn();
        const isWatchX = ref(true);
        const isWidthAuto = computed(() => false);

        const { onMousedown, onMousemove, onMouseup, current } = useResize(
            columns,
            widthMap,
            handleHeaderResize,
            isWatchX,
            isWidthAuto,
        ) as any;

        const target = document.createElement('div');
        const parent = document.createElement('th');
        Object.defineProperty(parent, 'offsetWidth', {
            value: 160,
            configurable: true,
        });
        parent.appendChild(target);

        // mousedown 记录起点，关闭横向滚动监听
        onMousedown(columns[0], 0, {
            clientX: 100,
            target,
        } as any);
        expect(current.value.id).toBe(1);
        expect(isWatchX.value).toBe(false);

        // mousemove +60：当前列宽 = offset + 快照宽 = 60 + 100，右侧列均摊变窄
        onMousemove(makeEvent(160));
        expect(widthMap.value[1].width).toBe(60 + 100);
        expect(widthMap.value[2].width).toBe(200 - 60);

        // mouseup：回报 resize 句柄，恢复横向滚动监听
        onMouseup(makeEvent(160));
        expect(handleHeaderResize).toHaveBeenCalledTimes(1);
        const payload = handleHeaderResize.mock.calls[0][0];
        expect(payload.current).toMatchObject({
            prop: 'name',
            width: 160,
            index: 0,
        });
        expect(payload.columns).toHaveLength(2);
        expect(payload.columns[0].prop).toBe('name');
        expect(payload.columns[1].prop).toBe('age');
        expect(isWatchX.value).toBe(true);
        expect(current.value).toBeNull();
    });

    test('isWidthAuto=true 时：拖拽只更新当前列，min/max/width 同步（L59 else 分支）', () => {
        const columns = makeColumns() as any;
        const widthMap = makeWidthMap() as any;
        const handleHeaderResize = vi.fn();
        const isWatchX = ref(true);
        const isWidthAuto = computed(() => true);

        const { onMousedown, onMousemove, onMouseup } = useResize(
            columns,
            widthMap,
            handleHeaderResize,
            isWatchX,
            isWidthAuto,
        ) as any;

        const target = document.createElement('div');
        const parent = document.createElement('th');
        Object.defineProperty(parent, 'offsetWidth', {
            value: 120,
            configurable: true,
        });
        parent.appendChild(target);

        onMousedown(columns[0], 0, { clientX: 50, target } as any);
        onMousemove(makeEvent(80)); // +30
        const col1 = widthMap.value[1];
        expect(col1.width).toBe(150);
        expect(col1.minWidth).toBe(150);
        expect(col1.maxWidth).toBe(150);
        // auto 布局不摊薄右侧列
        expect(widthMap.value[2].width).toBe(200);

        onMouseup(makeEvent(80));
        expect(handleHeaderResize).toHaveBeenCalledTimes(1);
    });

    test('mousemove 在 mousedown 之前：无 current 直接早退（L50）', () => {
        const columns = makeColumns() as any;
        const widthMap = makeWidthMap() as any;
        const handleHeaderResize = vi.fn();
        const isWatchX = ref(true);

        const { onMousemove } = useResize(
            columns,
            widthMap,
            handleHeaderResize,
            isWatchX,
            computed(() => false),
        ) as any;

        onMousemove(makeEvent(200));
        expect(handleHeaderResize).not.toHaveBeenCalled();
        expect(widthMap.value[1].width).toBe(100);
    });

    test('防御分支：current 已设但 _widthMap 缺失 → mousemove 早退不改宽度（L53）', () => {
        // L53 是防御性守卫：current 由 composable 返回暴露，外部（如 header.tsx
        // 的 is-active 判断）可读取；若被异常置位而列宽快照尚未建立，mousemove
        // 不应改写 widthMap。
        const columns = makeColumns() as any;
        const widthMap = makeWidthMap() as any;
        const handleHeaderResize = vi.fn();
        const isWatchX = ref(true);

        const { onMousemove, current } = useResize(
            columns,
            widthMap,
            handleHeaderResize,
            isWatchX,
            computed(() => false),
        ) as any;

        // 未经过 onMousedown，_widthMap 为 null；手工置位 current 模拟脏状态
        current.value = { id: 1, columnIndex: 0, clientX: 100, width: 100 };
        onMousemove(makeEvent(160));
        expect(widthMap.value[1].width).toBe(100);
        expect(widthMap.value[2].width).toBe(200);
        expect(handleHeaderResize).not.toHaveBeenCalled();
    });

    test('防御分支：mouseup 时列已从 columns 移除 → 早退不回报（L84）', () => {
        // 动态列场景：mousedown 后列被移除（columns 快照已不含该 id），
        // mouseup 找不到 currentColumnInstance 应安全早退。
        const columns = makeColumns() as any;
        const widthMap = makeWidthMap() as any;
        const handleHeaderResize = vi.fn();
        const isWatchX = ref(true);

        const { onMousedown, onMousemove, onMouseup, current } = useResize(
            columns,
            widthMap,
            handleHeaderResize,
            isWatchX,
            computed(() => false),
        ) as any;

        const target = document.createElement('div');
        const parent = document.createElement('th');
        Object.defineProperty(parent, 'offsetWidth', {
            value: 100,
            configurable: true,
        });
        parent.appendChild(target);

        // mousedown 使用 columns 中的列，随后 columns 被清空（模拟动态移除）
        onMousedown(columns[0], 0, { clientX: 100, target } as any);
        onMousemove(makeEvent(140));
        columns.length = 0;
        onMouseup(makeEvent(140));

        // 该列已不在 columns：不触发 handleHeaderResize；current 仍未复位
        // （保持拖拽状态等待合法 mouseup —— 现有实现语义）
        expect(handleHeaderResize).not.toHaveBeenCalled();
        expect(current.value).not.toBeNull();
    });
});
