import { describe, expect, test, vi } from 'vitest';
import { nextTick, reactive } from 'vue';
import useSpecialModel from '../useSpecialModel';

/**
 * useSpecialModel 分支补全（基线 7/10，死分支）：
 * - L16[1] config 缺省 prop → 回退 'modelValue'
 * - L19[0] pureUpdateCurrentValue 内 value === currentValue.value（受控回写同值）
 * - L20[2] config.isEqual && isEqual(...)（深比较相等 → 提前返回）
 *
 * 纯 composable，直接调用 + reactive props + vi.fn emit。
 * 受控回写路径（watch 生效）是命中 L19/L20 早退分支的真实链路：
 * 父组件收到 update 事件后把值写回 prop，内部模型已相同 → watch → pure 早退。
 */
describe('useSpecialModel', () => {
    test('config 缺省 prop 时回退 modelValue，emit update:modelValue', () => {
        const props = reactive<Record<string, any>>({ modelValue: 1 });
        const emit = vi.fn();
        const callback = vi.fn();
        // 传空对象 config：usingProp 回退 'modelValue'
        const [model, update] = useSpecialModel(props, emit, {}, callback);
        expect(model.value).toBe(1);

        update(3);
        expect(model.value).toBe(3);
        expect(emit).toHaveBeenCalledWith('update:modelValue', 3);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('同值设置提前返回：不 emit 不回调，内部模型保持不变', () => {
        const props = reactive<Record<string, any>>({ currentPage: 2 });
        const emit = vi.fn();
        const callback = vi.fn();
        const [model, update] = useSpecialModel(
            props,
            emit,
            { prop: 'currentPage' },
            callback,
        );
        expect(model.value).toBe(2);

        // 第一次设置不同值：正常 emit + 回调
        update(5);
        expect(model.value).toBe(5);
        expect(emit).toHaveBeenCalledWith('update:currentPage', 5);
        expect(callback).toHaveBeenCalledTimes(1);

        // 同值设置：updateCurrentValue L28 早退，不再 emit
        update(5);
        expect(emit).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('受控回写同值：watch 命中 pure 的 value===currentValue 早退分支', async () => {
        const props = reactive<Record<string, any>>({ currentPage: 1 });
        const emit = vi.fn();
        const callback = vi.fn();
        const [model, update] = useSpecialModel(
            props,
            emit,
            { prop: 'currentPage' },
            callback,
        );

        // 非受控 setter：内部模型 1 → 4，emit 给父组件
        update(4);
        expect(model.value).toBe(4);
        expect(emit).toHaveBeenCalledWith('update:currentPage', 4);
        expect(callback).toHaveBeenCalledTimes(1);

        // 父组件受控回写：props.currentPage = 4（与内部模型相同值）
        // watch → pureUpdateCurrentValue(4)：4 === 4 → L19 早退，模型不变
        props.currentPage = 4;
        await nextTick();
        expect(model.value).toBe(4);
        // 回写不产生新 emit / 回调
        expect(emit).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('受控回写不同值：watch 同步内部模型（普通 Watch 路径）', async () => {
        const props = reactive<Record<string, any>>({ currentPage: 1 });
        const emit = vi.fn();
        const callback = vi.fn();
        const [model] = useSpecialModel(
            props,
            emit,
            { prop: 'currentPage' },
            callback,
        );

        // 父组件直接驱动 prop 变化 → watch 同步内部模型
        props.currentPage = 8;
        await nextTick();
        expect(model.value).toBe(8);
        expect(emit).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
    });

    test('isEqual：外部回写深比较相等的对象 → pure 早退，模型不追平', async () => {
        const props = reactive<{ modelValue?: any }>({ modelValue: { a: 1 } });
        const emit = vi.fn();
        const callback = vi.fn();
        const [model, update] = useSpecialModel(
            props,
            emit,
            { isEqual: true },
            callback,
        );
        expect(model.value).toEqual({ a: 1 });

        // setter 传引用不同的新对象：value !== currentValue →
        // config.isEqual && isEqual(...) 为真 → L20 早退，模型保持原引用不变
        const sameInContent = { a: 1 };
        update(sameInContent);
        // 注：updateCurrentValue 在 pure 早退后仍会 emit（当前实现语义，非 isEqual 分支行为）
        expect(model.value).not.toBe(sameInContent);
        expect(model.value).toEqual({ a: 1 });
        expect(callback).toHaveBeenCalledTimes(1);

        // 父组件把相等内容写回 prop → watch → pure 深比较相等 → 早退
        props.modelValue = { a: 1 };
        await nextTick();
        expect(model.value).toEqual({ a: 1 });
        expect(emit).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);

        // 真正变化的值：模型更新 + emit
        update({ b: 2 });
        expect(model.value).toEqual({ b: 2 });
        expect(emit).toHaveBeenCalledTimes(2);
    });
});
