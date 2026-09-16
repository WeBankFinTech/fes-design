import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import FMessage from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('message');
const alertCls = getPrefixCls('alert');

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
        await wait(50);
        await nextTick();

        const wrapper = document.querySelector(`.${prefixCls}-wrapper`);
        expect(wrapper).not.toBeNull();
        const item = document.querySelector(`.${prefixCls}-item`);
        expect(item).not.toBeNull();
        expect(item.textContent).toContain('info message');
        expect(document.querySelector(`.${alertCls}-info`)).not.toBeNull();
    });

    test('success/warning/error 类型类名', async () => {
        FMessage.success('success message');
        FMessage.warning('warning message');
        FMessage.error('error message');
        await wait(50);
        await nextTick();

        expect(document.querySelector(`.${alertCls}-success`)).not.toBeNull();
        expect(document.querySelector(`.${alertCls}-warning`)).not.toBeNull();
        expect(document.querySelector(`.${alertCls}-error`)).not.toBeNull();
    });

    test('duration 后自动消失', async () => {
        FMessage.info({ content: 'auto close', duration: 0.3 });
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        // duration 定时器触发后消失：waitFor 轮询（比盲等 600ms 更快）
        await vi.waitFor(() => {
            expect(document.querySelector(`.${prefixCls}-item`)).toBeNull();
        });
    });

    test('duration=0 时不自动消失', async () => {
        FMessage.info({ content: 'keep alive', duration: 0 });
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        await wait(200);
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        FMessage.destroy();
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeNull();
    });

    test('destroy 清空消息', async () => {
        FMessage.info('destroy message');
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        FMessage.destroy();
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeNull();
    });

    test('closable 手动关闭并触发 afterClose', async () => {
        const afterClose = vi.fn();
        FMessage.info({
            content: 'closable message',
            closable: true,
            duration: 0,
            afterClose,
        });
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        const closeBtn = document.querySelector(
            `.${alertCls}-head-right-close span`,
        );
        expect(closeBtn).not.toBeNull();
        closeBtn.click();
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeNull();
        expect(afterClose).toHaveBeenCalledTimes(1);
    });

    test('config 设置 maxCount 限制消息数量', async () => {
        FMessage.config({ maxCount: 2, duration: 0 });
        FMessage.info('msg 1');
        // 等待 manager 创建完成（首次调用会异步 createManager），
        // 之后的两条消息才会计入 maxCount
        await wait(50);
        await nextTick();
        FMessage.info('msg 2');
        FMessage.info('msg 3');
        await wait(50);
        await nextTick();

        expect(
            document.querySelectorAll(`.${prefixCls}-item`).length,
        ).toBeLessThanOrEqual(2);
        // 恢复默认配置（config 为整体替换）
        FMessage.config({ duration: 3 });
    });

    test('返回 destroy 方法可单独移除消息', async () => {
        const msg = FMessage.info('destroy by handle');
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).not.toBeNull();

        msg.destroy();
        await wait(50);
        await nextTick();
        expect(document.querySelector(`.${prefixCls}-item`)).toBeNull();
    });
});
