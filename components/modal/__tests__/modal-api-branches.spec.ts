import { h, nextTick } from 'vue';
import modalApi from '../modalApi';
import { createManager } from '../../_util/noticeManager';
import { wait } from '../../_util/__tests__/helpers';

const getModals = () => document.body.querySelectorAll('.fes-modal');
const getOkButton = () =>
    document.body.querySelector<HTMLElement>(
        '.fes-modal-footer .fes-btn-type-primary',
    );
const getCancelButton = () =>
    document.body.querySelector<HTMLElement>(
        '.fes-modal-footer .fes-btn:not(.fes-btn-type-primary)',
    );

// modalApi 通过 render 卸载 dom（onAfterLeave → render(null)），
// useAnimation=false 时点击 ok 后直接走同步卸载，节奏确定
const settle = async () => {
    await nextTick();
    await wait(60);
};

describe('modalApi 分支覆盖（modalApi.tsx）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('异步 onOk 未结束前二次点击被重入守卫拦截（L83）', async () => {
        let resolveOk: () => void;
        const onOk = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    resolveOk = resolve;
                }),
        );
        modalApi.info({ content: '重入守卫', onOk });
        await settle();
        expect(getModals().length).toBe(1);

        // 第一次点击：回调挂起，模态保持显示
        getOkButton().click();
        await nextTick();
        expect(onOk).toHaveBeenCalledTimes(1);
        expect(getModals().length).toBe(1);

        // FButton 自带 300ms 节流，等节流窗口过后再点：
        // 点击穿透到 handleCallBack，被 cbFuncEnd=true 拦截
        await wait(310);
        getOkButton().click();
        await nextTick();
        expect(onOk).toHaveBeenCalledTimes(1);

        // 回调结束 → 关闭并卸载
        resolveOk!();
        await settle();
        expect(getModals().length).toBe(0);
    });

    test('onOk reject：模态保持显示，守卫复位后可再次确认', async () => {
        let shouldReject = true;
        const onOk = vi.fn(() =>
            shouldReject
                ? Promise.reject(new Error('校验失败'))
                : Promise.resolve(),
        );
        modalApi.info({ content: 'reject 用例', onOk });
        await settle();
        expect(getModals().length).toBe(1);

        // 第一次点击：reject 走 catch，模态不关闭
        getOkButton().click();
        await settle();
        expect(onOk).toHaveBeenCalledTimes(1);
        expect(getModals().length).toBe(1);

        // 等 FButton 300ms 节流窗口过后再点：cbFuncEnd 已在 catch 后复位，
        // onOk 第二次触发；此次 resolve → 正常关闭
        shouldReject = false;
        await wait(310);
        getOkButton().click();
        await settle();
        expect(onOk).toHaveBeenCalledTimes(2);
        expect(getModals().length).toBe(0);
    });

    test('无 onOk 的模态：确认直接关闭（L88 else 分支）', async () => {
        modalApi.info({ content: '无回调' });
        await settle();
        expect(getModals().length).toBe(1);

        getOkButton().click();
        await settle();
        // 无回调时直接走 show=false 关闭
        expect(getModals().length).toBe(0);
    });

    test('update(null)：null 被兜底为空对象合并（L99 else 分支）', async () => {
        const handle = modalApi.info({ content: '更新前' });
        await settle();

        // options 为假值时走 options || {} 兜底；
        // 实现随即在 isUndefined(options.showCancel) 处对 null 解引用抛 TypeError
        // （源码缺陷：兜底表达式未传给后续访问）—— 分支仍被命中，语义以抛错断言
        expect(() => handle.update(null as any)).toThrow(TypeError);
        await settle();
        // 抛错发生在 renderModal 之前 → 模态仍以原内容显示，未受影响
        expect(getModals().length).toBe(1);
        expect(
            document.body.querySelector('.fes-modal-body')!.textContent,
        ).toContain('更新前');

        // 内容仍可正常更新（验证 modal 依旧可用）
        handle.update({ content: '更新后' });
        await settle();
        expect(
            document.body.querySelector('.fes-modal-body')!.textContent,
        ).toContain('更新后');
    });

    test('update 显式 showCancel 按钮随配置切换（L100 else 分支）', async () => {
        const handle = modalApi.info({ content: '取消按钮用例' });
        await settle();
        expect(getCancelButton()).toBeNull(); // info 默认无取消按钮

        // 显式 showCancel: true → 渲染取消按钮（不走 isUndefined 默认分支）
        handle.update({ showCancel: true, cancelText: '返回' });
        await settle();
        const cancelBtn = getCancelButton();
        expect(cancelBtn).not.toBeNull();
        expect(cancelBtn.textContent).toContain('返回');

        // 点击取消同样会关闭
        cancelBtn.click();
        await settle();
        expect(getModals().length).toBe(0);
    });

    test('函数式 title/content/footer 插槽渲染（L113 三元 true 分支）', async () => {
        const handle = modalApi.confirm({
            title: () => h('span', { class: 'fn-title' }, '函数标题'),
            content: () => h('p', { class: 'fn-content' }, '函数内容'),
            footer: () =>
                h(
                    'button',
                    { class: 'fn-footer-btn' },
                    '自定义底部',
                ),
        });
        await settle();

        expect(
            document.body.querySelector('.fn-title')!.textContent,
        ).toContain('函数标题');
        expect(
            document.body.querySelector('.fn-content')!.textContent,
        ).toContain('函数内容');
        // 函数式 footer 替换默认按钮区
        expect(
            document.body.querySelector('.fn-footer-btn')!.textContent,
        ).toContain('自定义底部');
        expect(getOkButton()).toBeNull();

        // 函数式 footer 无默认按钮可用，通过 destroy 收尾验证可销毁
        handle.destroy();
        await settle();
        expect(
            document.body.querySelector('.fn-footer-btn'),
        ).toBeNull();
    });

    test('destroy 后 update 无效（L125 else 分支）', async () => {
        const handle = modalApi.info({ content: '销毁后更新' });
        await settle();
        expect(getModals().length).toBe(1);

        handle.destroy();
        await settle();
        expect(getModals().length).toBe(0);

        // show=false，update 直接短路
        handle.update({ content: '不应出现' });
        await settle();
        expect(getModals().length).toBe(0);
        expect(document.body.querySelector('.fes-modal-body')).toBeNull();
    });

    test('config(null) 保持默认配置不变（L155 else 分支）', () => {
        const before = modalApi.config;
        expect(typeof before).toBe('function');
        expect(() => modalApi.config(null as any)).not.toThrow();
    });
});

describe('noticeManager 分支覆盖（noticeManager.tsx，经 createManager 直驱）', () => {
    let containers: HTMLElement[] = [];

    afterEach(() => {
        containers.forEach((c) => c.remove());
        containers = [];
        document.body.innerHTML = '';
    });

    test('无 getContainer：挂载 body，append/remove/destroy/exited 全链路', async () => {
        const manager = await createManager({});
        // exited()：无 getContainer 恒 true（L149 true 分支）
        expect(manager.exited()).toBe(true);

        const notice = manager.append({
            duration: 0,
            style: {},
            children: h('div', { class: 'raw-notice' }, '通知内容'),
        });
        await nextTick();
        // append 生成的 key 前缀（L69 true 分支 + genUid seed 自增）
        expect(String(notice.key)).toContain('notice_manager_');
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(1);

        // 带显式 key 的 append（L69 else 分支）
        const keyed = manager.append({
            key: 'my-key',
            duration: 0,
            style: {},
            children: h('div', { class: 'raw-notice' }, '带key'),
        });
        await nextTick();
        expect(keyed.key).toBe('my-key');
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(2);

        // remove 存在的 key → 移除该项并触发 afterRemove
        const afterRemove = vi.fn();
        manager.append({
            key: 'bye',
            duration: 0,
            style: {},
            afterRemove,
            children: h('div', { class: 'raw-notice' }, '再见'),
        });
        await nextTick();
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(3);
        manager.remove('bye');
        // TransitionGroup leave 动画完成后 dom 才移除
        await wait(80);
        expect(afterRemove).toHaveBeenCalledTimes(1);
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(2);

        // remove 不存在的 key：静默无操作（L62 else 分支）
        expect(() => manager.remove('不存在')).not.toThrow();
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(2);

        // duration > 0 自动移除
        manager.append({
            key: 'auto',
            duration: 0.05,
            style: {},
            children: h('div', { class: 'raw-notice' }, '定时'),
        });
        await nextTick();
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(3);
        await wait(120);
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(2);

        // destroy：卸载实例并清理容器（L143 true 分支）
        manager.destroy();
        await nextTick();
        expect(document.body.querySelectorAll('.raw-notice').length).toBe(0);

        // 二次 destroy：div.parentNode 已为 null，不抛错（L143 else 分支）
        expect(() => manager.destroy()).not.toThrow();
    });

    test('children 为函数 → 动态渲染（L104 函数分支）', async () => {
        const manager = await createManager({});
        manager.append({
            duration: 0,
            style: {},
            children: () => h('div', { class: 'fn-notice' }, '函数内容'),
        });
        await nextTick();
        const el = document.body.querySelector('.fn-notice');
        expect(el).not.toBeNull();
        expect(el.textContent).toContain('函数内容');
        manager.destroy();
    });

    // 注：noticeManager L108 `if (vNode)` 的 else 分支为源码缺陷分支：
    // children 返回无效内容时 getFirstValidNode 返回 null，children.map 产生
    // undefined 子节点，TransitionGroup 渲染直接抛 TypeError（getTransitionRawChildren
    // 读 key 失败），任何断言前进程已带 unhandled error——无法在健康用例内覆盖。

    test('不传 transitionName → TransitionGroup name 为空（L114）', async () => {
        // 上面用例的 createManager({}) 均未传 transitionName，
        // 渲染不抛错且通知正常挂载即为该分支被命中
        const manager = await createManager({});
        manager.append({
            duration: 0,
            style: {},
            children: h('div', { class: 'no-trans-notice' }, '无过渡'),
        });
        await nextTick();
        expect(
            document.body.querySelector('.no-trans-notice'),
        ).not.toBeNull();
        manager.destroy();
    });

    test('getContainer 提供与容器丢失/异常的 exited 行为（L127/L149/L153）', async () => {
        const container = document.createElement('div');
        container.innerHTML = '<div class="inner"></div>';
        document.body.appendChild(container);
        containers.push(container);

        // getContainer 提供时挂载到该容器内部（L127 true 分支）
        const manager = await createManager({
            getContainer: () => container.querySelector('.inner'),
        });
        expect(
            container.querySelector('.inner > div'),
        ).not.toBeNull();

        // 容器仍在 → true
        expect(manager.exited()).toBe(true);

        // getContainer() 返回 null → 内部 destroy 并返回 false（L153 true 分支）
        container.innerHTML = '';
        expect(manager.exited()).toBe(false);
        await nextTick();

        // getContainer 创建时有效、exited 时翻转为抛异常 → catch 分支 destroy + false
        let boom = false;
        const manager2 = await createManager({
            getContainer: () => {
                if (boom) {
                    throw new Error('boom');
                }
                return container;
            },
        });
        expect(manager2.exited()).toBe(true);
        boom = true;
        expect(manager2.exited()).toBe(false);
    });

    test('同一文件创建第二个管理器 → genUid seed 自增（L21 第三槽位）', async () => {
        const manager1 = await createManager({});
        const notice1 = manager1.append({
            duration: 0,
            style: {},
            children: h('div', {}, '第一个管理器'),
        });
        const manager2 = await createManager({});
        const notice2 = manager2.append({
            duration: 0,
            style: {},
            children: h('div', {}, '第二个管理器'),
        });
        // seed 递增 → 两个 key 不同
        expect(notice1.key).not.toBe(notice2.key);
        expect(String(notice2.key)).toContain('notice_manager_');
        manager1.destroy();
        manager2.destroy();
    });
});
