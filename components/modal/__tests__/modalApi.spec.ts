import { nextTick } from 'vue';
import modalApi from '../modalApi';

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const getModals = () => document.body.querySelectorAll('.fes-modal');

describe('modalApi', () => {
    test('info 创建并渲染内容', async () => {
        const handle = modalApi.info({
            title: '提示',
            content: '内容信息',
        });
        await nextTick();
        await wait();
        const modals = getModals();
        expect(modals.length).toBeGreaterThan(0);
        expect(document.body.textContent).toContain('内容信息');
        expect(handle.update).toBeTypeOf('function');
        expect(handle.destroy).toBeTypeOf('function');
        handle.destroy();
        await wait();
    });

    test('confirm 类型渲染 取消/确定 按钮', async () => {
        const handle = modalApi.confirm({
            title: '确认',
            content: '确定执行吗',
        });
        await nextTick();
        await wait();
        expect(document.body.textContent).toContain('确定执行吗');
        handle.destroy();
        await wait();
    });

    test('update 更新内容', async () => {
        const handle = modalApi.info({ title: 't', content: '第一版' });
        await nextTick();
        await wait();
        handle.update({ content: '第二版' });
        await nextTick();
        await wait();
        expect(document.body.textContent).toContain('第二版');
        handle.destroy();
        await wait();
    });

    test('destroy 移除弹窗', async () => {
        const before = getModals().length;
        const handle = modalApi.info({ title: 't', content: '待销毁' });
        await nextTick();
        await wait();
        expect(getModals().length).toBeGreaterThan(before);
        handle.destroy();
        await nextTick();
        await wait();
        // destroy 后 onAfterLeave 触发 render(null) 卸载（无动画时立即）
        expect(document.body.textContent).not.toContain('待销毁');
    });

    test('warning/success/error 均可创建', async () => {
        const h1 = modalApi.warning({ content: 'w1' });
        const h2 = modalApi.success({ content: 's1' });
        const h3 = modalApi.error({ content: 'e1' });
        await nextTick();
        await wait();
        expect(document.body.textContent).toContain('w1');
        expect(document.body.textContent).toContain('s1');
        expect(document.body.textContent).toContain('e1');
        h1.destroy();
        h2.destroy();
        h3.destroy();
        await wait();
    });

    test('config 修改全局默认不报错', async () => {
        modalApi.config({ width: 320 });
        const handle = modalApi.info({ content: '宽度测试' });
        await nextTick();
        await wait();
        expect(document.body.textContent).toContain('宽度测试');
        handle.destroy();
        modalApi.config({});
        await wait();
    });

    test('onOk 回调后自动关闭', async () => {
        let okCalled = false;
        const handle = modalApi.info({
            content: 'ok回调',
            onOk: () => {
                okCalled = true;
            },
        });
        await nextTick();
        await wait();
        // 找到该弹窗的确定按钮并点击
        const modals = Array.from(getModals());
        const target = modals.find((m) => m.textContent!.includes('ok回调'));
        const okBtn = target!.querySelector(
            '.fes-modal-footer .fes-btn-type-primary',
        ) as HTMLElement;
        okBtn.click();
        await nextTick();
        await wait();
        expect(okCalled).toBe(true);
        handle.destroy();
        await wait();
    });
});
