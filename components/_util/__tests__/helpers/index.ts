/**
 * 共享测试工具（技能第九节-1，element-plus test-utils 模式）
 *
 * 收敛此前 62 处散落的 wait/sleep 重复定义：
 * - wait(ms)：定长等待（节流/防抖场景）
 * - sleep(times)：Vue nextTick 多轮（弹层渲染链）
 * - isChecked/isIndeterminate：勾选状态辅助（naive-ui Tree 模式）
 * - makeScroll：设 scrollLeft/Top 并派发 scroll 事件
 */
import { nextTick } from 'vue';

/** 定长等待：默认 60ms（节流/防抖场景的最小窗口） */
export const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

/** 多轮 nextTick：弹层渲染链（Teleport → popper → 面板） */
export const sleep = (times = 2) => {
    let promise = Promise.resolve();
    for (let i = 0; i < times; i++) {
        promise = promise.then(() => nextTick());
    }
    return promise;
};

/** 勾选状态辅助（技能 4A-1）：断言意图一眼可读 */
export const isChecked = (box: { classes: () => string[] }) =>
    box.classes().includes('is-checked')
    || box.classes().includes('fes-checkbox-is-checked');

/** 半选状态辅助 */
export const isIndeterminate = (box: { classes: () => string[] }) =>
    box.classes().includes('is-indeterminate')
    || box.classes().includes('fes-checkbox-is-indeterminate');

/** makeScroll（element-plus 模式）：设滚动位并派发 scroll 事件 */
export const makeScroll = async (
    el: HTMLElement | Window,
    axis: 'x' | 'y',
    value: number,
) => {
    if (axis === 'x') {
        (el as HTMLElement).scrollLeft = value;
    } else {
        (el as HTMLElement).scrollTop = value;
    }
    el.dispatchEvent(new Event('scroll'));
    await wait();
};
