import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import FMessage from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('message');
const alertCls = getPrefixCls('alert');

const sleep = (ms) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

describe('Message', () => {
    beforeEach(() => {
        FMessage.destroy();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        FMessage.destroy();
    });

    test('info 挂载消息节点到 body', async () => {
        FMessage.info('info message');
        // createManager 是异步创建的
        await sleep(50);
        await nextTick();

        const wrapper = document.querySelector(`.${prefixCls}-wrapper`);
        expect(wrapper).not.toBeNull();
        const item = document.querySelector(`.${prefixCls}-item`);
        expect(item).not.toBeNull();
        expect(item.textContent).toContain('info message');
        expect(document.querySelector(`.${alertCls}-info`)).toBeTruthy();
    });

    test('success/warning/error 类型类名', async () => {
        FMessage.success('success message');
        FMessage.warning('warning message');
        FMessage.error('error message');
        await sleep(50);
        await nextTick();

        expect(document.querySelector(`.${alertCls}-success`)).toBeTruthy();
        expect(document.querySelector(`.${alertCls}-warning`)).toBeTruthy();
        expect(document.querySelector(`.${alertCls}-error`)).toBeTruthy();
    });

    test('duration 后自动消失', async () => {
        FMessage.info({ content: 'auto close', duration: 0.3 });
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        await sleep(600);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeFalsy();
    });

    test('duration=0 时不自动消失', async () => {
        FMessage.info({ content: 'keep alive', duration: 0 });
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        await sleep(200);
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        FMessage.destroy();
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeFalsy();
    });

    test('destroy 清空消息', async () => {
        FMessage.info('destroy message');
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        FMessage.destroy();
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeFalsy();
    });

    test('closable 手动关闭并触发 afterClose', async () => {
        const afterClose = vi.fn();
        FMessage.info({
            content: 'closable message',
            closable: true,
            duration: 0,
            afterClose,
        });
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        const closeBtn = document.querySelector(
            `.${alertCls}-head-right-close span`,
        );
        expect(closeBtn).not.toBeNull();
        closeBtn.click();
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeFalsy();
        expect(afterClose).toHaveBeenCalledTimes(1);
    });

    test('config 设置 maxCount 限制消息数量', async () => {
        FMessage.config({ maxCount: 2, duration: 0 });
        FMessage.info('msg 1');
        // 等待 manager 创建完成（首次调用会异步 createManager），
        // 之后的两条消息才会计入 maxCount
        await sleep(50);
        await nextTick();
        FMessage.info('msg 2');
        FMessage.info('msg 3');
        await sleep(50);
        await nextTick();

        expect(
            document.querySelectorAll(`.${prefixCls}-item`).length,
        ).toBeLessThanOrEqual(2);
        // 恢复默认配置（config 为整体替换）
        FMessage.config({ duration: 3 });
    });

    test('返回 destroy 方法可单独移除消息', async () => {
        const msg = FMessage.info('destroy by handle');
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeTruthy();

        msg.destroy();
        await sleep(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeFalsy();
    });
});
