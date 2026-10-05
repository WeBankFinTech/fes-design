// Upload 分支补全测试：聚焦 useUpload / uploadDragger / trigger 的死分支，
// 全程使用真实 File 对象 + DataTransfer mock + stubGlobal(XMLHttpRequest) 驱动，
// 断言用户可感知行为（file-list 渲染、remove/exceed/success/error 事件）。
import {
    flushPromises,
    mount,
} from '@vue/test-utils';
import { defineComponent, h, nextTick, reactive } from 'vue';
import Upload from '../upload';
import UploadDragger from '../uploadDragger';
// vi.mock 会被提升到文件顶部，dragger 内 FMessage.error 同样命中此 mock
import FMessage from '../../message';
import getPrefixCls from '../../_util/getPrefixCls';

vi.mock('../../message', () => ({
    default: {
        error: vi.fn(),
    },
}));

const prefixCls = getPrefixCls('upload');
const messageError = FMessage.error as unknown as ReturnType<typeof vi.fn>;

// ---------------- mock XMLHttpRequest -------------------

class MockXHR {
    static instances: MockXHR[] = [];

    upload: any = { onprogress: null };

    status = 0;

    response = '';

    responseText = '';

    withCredentials = false;

    timeout = 0;

    open = vi.fn();

    setRequestHeader = vi.fn();

    send = vi.fn();

    abort = vi.fn();

    onload: any = null;

    onerror: any = null;

    constructor() {
        MockXHR.instances.push(this);
    }
}

beforeEach(() => {
    MockXHR.instances = [];
    messageError.mockClear();
    vi.stubGlobal('XMLHttpRequest', MockXHR);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

// ---------------- helpers -------------------

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

function createFile(name: string, type = 'text/plain') {
    return new File([name], name, { type });
}

function createDataTransfer(files: File[] = []) {
    return {
        files,
        dropEffect: 'copy',
        effectAllowed: 'all',
        getData: vi.fn(() => ''),
        setData: vi.fn(),
    };
}

async function chooseFiles(
    wrapper: any,
    files: File[] | null,
    selector = `.${prefixCls}-input`,
) {
    const input = wrapper.find(selector);
    Object.defineProperty(input.element, 'files', {
        value: files,
        configurable: true,
    });
    await input.trigger('change');
}

// 拖拽事件必须手工 dispatch：需要 cancelable（断言 defaultPrevented）
// 以及自定义 dataTransfer（VTU trigger 对 drag 事件的属性注入依赖实现细节）
function fireDrag(el: Element, type: string, dataTransfer?: any) {
    const event = new Event(type, {
        bubbles: true,
        cancelable: true,
    }) as any;
    if (dataTransfer) {
        Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
    }
    el.dispatchEvent(event);
    return event;
}

// 宿主：Upload + Dragger 组合，返回事件 spies 便于精确断言
function mountDragger(uploadProps: Record<string, any>, draggerProps: Record<string, any> = {}) {
    const spies = {
        change: vi.fn(),
        exceed: vi.fn(),
        fileTypeInvalid: vi.fn(),
    };
    const wrapper = mount(
        defineComponent({
            setup() {
                return () =>
                    h(
                        Upload,
                        { ...uploadProps, onChange: spies.change, onExceed: spies.exceed },
                        {
                            default: () =>
                                h(UploadDragger, {
                                    onFileTypeInvalid: spies.fileTypeInvalid,
                                    ...draggerProps,
                                }),
                        },
                    );
            },
        }),
    );
    return { wrapper, spies };
}

async function settle() {
    await nextTick();
    await flushPromises();
}

// ---------------- trigger.vue -------------------

describe('trigger 点击与 change 守卫', () => {
    test('非禁用态点击触发区会打开文件选择框（input.click）', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        const clickSpy = vi.fn();
        const input = wrapper.find(`.${prefixCls}-input`);
        expect(input.exists()).toBe(true);
        input.element.click = clickSpy;
        await wrapper.find(`.${prefixCls}`).trigger('click');
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    test('input.files 为 null 时 change 被忽略，不进入上传流程', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        await chooseFiles(wrapper, null);
        expect(wrapper.emitted('change')).toBe(undefined);
        expect(MockXHR.instances.length).toBe(0);
    });
});

// ---------------- uploadDragger.tsx -------------------

describe('uploadDragger 拖拽分支', () => {
    test('dragover 在可用态阻止默认行为且保持 hovering', async () => {
        const { wrapper } = mountDragger({ action: '/upload' });
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        expect(dragger.exists()).toBe(true);
        const enterEvent = fireDrag(dragger.element, 'dragenter');
        await settle();
        expect(
            wrapper.find(`.${prefixCls}-dragger`).classes(),
        ).toContain('is-hovering');
        const overEvent = fireDrag(dragger.element, 'dragover');
        await settle();
        expect(overEvent.defaultPrevented).toBe(true);
        // dragover 不改变 hovering 状态
        expect(
            wrapper.find(`.${prefixCls}-dragger`).classes(),
        ).toContain('is-hovering');
        expect(enterEvent.defaultPrevented).toBe(true);
    });

    test('禁用态 dragover / dragleave 直接忽略且不阻止默认行为', async () => {
        const { wrapper, spies } = mountDragger({
            action: '/upload',
            disabled: true,
        });
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        expect(dragger.classes()).toContain('is-disabled');
        const leaveEvent = fireDrag(dragger.element, 'dragleave');
        await settle();
        expect(leaveEvent.defaultPrevented).toBe(false);
        const overEvent = fireDrag(dragger.element, 'dragover');
        await settle();
        expect(overEvent.defaultPrevented).toBe(false);
        expect(dragger.classes()).not.toContain('is-hovering');
        // 禁用态 drop 也不会进入上传
        fireDrag(
            dragger.element,
            'drop',
            createDataTransfer([createFile('a.txt')]),
        );
        await settle();
        expect(spies.change).not.toHaveBeenCalled();
        expect(MockXHR.instances.length).toBe(0);
    });

    test('drop 无文件时阻止默认行为后直接返回，不误清上传流程', async () => {
        const { wrapper, spies } = mountDragger({ action: '/upload' });
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        fireDrag(dragger.element, 'dragenter');
        await settle();
        expect(
            wrapper.find(`.${prefixCls}-dragger`).classes(),
        ).toContain('is-hovering');
        const event = fireDrag(dragger.element, 'drop', createDataTransfer([]));
        await settle();
        expect(event.defaultPrevented).toBe(true);
        // hovering 被 drop 复位
        expect(
            wrapper.find(`.${prefixCls}-dragger`).classes(),
        ).not.toContain('is-hovering');
        expect(spies.change).not.toHaveBeenCalled();
        expect(MockXHR.instances.length).toBe(0);
    });

    test('非 multiple 拖入多个文件只上传第一个', async () => {
        const { wrapper, spies } = mountDragger({ action: '/upload' });
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        fireDrag(
            dragger.element,
            'drop',
            createDataTransfer([
                createFile('a.txt'),
                createFile('b.txt'),
                createFile('c.txt'),
            ]),
        );
        await settle();
        expect(spies.change).toHaveBeenCalledTimes(1);
        expect(spies.change.mock.calls[0][0].file.name).toBe('a.txt');
        expect(MockXHR.instances.length).toBe(1);
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
    });

    test('未配置 accept 时拖入文件不做类型过滤直接上传', async () => {
        const { wrapper, spies } = mountDragger({ action: '/upload' });
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        const dt = createDataTransfer([createFile('a.any')]);
        fireDrag(dragger.element, 'drop', dt);
        await settle();
        expect(spies.fileTypeInvalid).not.toHaveBeenCalled();
        expect(messageError).not.toHaveBeenCalled();
        expect(spies.change).toHaveBeenCalledTimes(1);
        expect(MockXHR.instances.length).toBe(1);
        // 拖拽事件携带了完整 DataTransfer mock
        expect(typeof dt.getData).toBe('function');
    });

    test('类型不符且未传 onFileTypeInvalid 时降级为 FMessage.error 且不上传', async () => {
        // 显式传 undefined 才能命中「无 onFileTypeInvalid」的降级分支
        const { wrapper, spies } = mountDragger(
            {
                action: '/upload',
                multiple: true,
                accept: ['.png'],
            },
            { onFileTypeInvalid: undefined },
        );
        const dragger = wrapper.find(`.${prefixCls}-dragger`);
        fireDrag(
            dragger.element,
            'drop',
            createDataTransfer([createFile('a.txt')]),
        );
        await settle();
        expect(messageError).toHaveBeenCalledTimes(1);
        expect(messageError).toHaveBeenCalledWith('上传文件格式不正确！');
        expect(spies.fileTypeInvalid).not.toHaveBeenCalled();
        expect(spies.change).not.toHaveBeenCalled();
        expect(MockXHR.instances.length).toBe(0);
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(0);
    });

    test('拖入子元素触发 hovering；拖出子元素复位；drop 复位 hovering 并上传', async () => {
        const { wrapper, spies } = mountDragger(
            { action: '/upload' },
            // dragger 默认插槽：真实子元素，验证事件冒泡到 dragger 根节点
            {},
        );
        // 重新挂一个带子元素的 dragger
        wrapper.unmount();
        const childWrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, { action: '/upload' }, {
                            default: () =>
                                h(
                                    UploadDragger,
                                    {},
                                    {
                                        default: () =>
                                            h('span', { class: 'drag-child' }, '拖我'),
                                    },
                                ),
                        });
                },
            }),
        );
        const child = childWrapper.find('.drag-child');
        expect(child.exists()).toBe(true);
        // 拖入子元素：dragenter 冒泡到 dragger 根，hovering 打开
        fireDrag(child.element, 'dragenter');
        await settle();
        expect(
            childWrapper.find(`.${prefixCls}-dragger`).classes(),
        ).toContain('is-hovering');
        // 现状锁定：组件未做 dragenter/dragleave 计数，拖出子元素即关 hovering
        // （真实浏览器中拖到子元素再移出可能仍悬停在根上，此处按实现现状断言）
        fireDrag(child.element, 'dragleave');
        await settle();
        expect(
            childWrapper.find(`.${prefixCls}-dragger`).classes(),
        ).not.toContain('is-hovering');

        // drop 用完整 DataTransfer mock 手工派发
        const draggerEl = childWrapper.find(`.${prefixCls}-dragger`).element;
        const dt = createDataTransfer([createFile('dropped.txt')]);
        const event = fireDrag(draggerEl, 'drop', dt);
        await settle();
        expect(event.defaultPrevented).toBe(true);
        expect(
            childWrapper.find(`.${prefixCls}-dragger`).classes(),
        ).not.toContain('is-hovering');
        expect(spies.change.mock.calls.length).toBe(0);
        expect(MockXHR.instances.length).toBe(1);
        // 列表渲染出拖入文件
        expect(
            childWrapper.find(`.${prefixCls}-list-item`).text(),
        ).toContain('dropped.txt');
        childWrapper.unmount();
    });
});

// ---------------- useUpload 回调守卫 -------------------

describe('文件移除后迟到的上传回调被安全忽略', () => {
    test('移除后收到 progress 回调：不 emit progress', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        await chooseFiles(wrapper, [createFile('a.txt')]);
        await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
        expect(wrapper.emitted('remove').length).toBe(1);
        const xhr = MockXHR.instances[0] as any;
        // 移除时中止请求（用户可感知的取消行为）
        expect(xhr.abort).toHaveBeenCalledTimes(1);
        // 迟到的 progress 被守卫拦截（change 仅 onStart + onRemove 两次）
        xhr.upload.onprogress({ loaded: 30, total: 100 });
        await settle();
        expect(wrapper.emitted('progress')).toBe(undefined);
        expect(wrapper.emitted('change').length).toBe(2);
        wrapper.unmount();
    });

    test('移除后收到 success 回调：不 emit success，列表保持为空', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        await chooseFiles(wrapper, [createFile('a.txt')]);
        await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
        const xhr = MockXHR.instances[0] as any;
        xhr.status = 200;
        xhr.responseText = '{"ok":1}';
        xhr.onload();
        await settle();
        expect(wrapper.emitted('success')).toBe(undefined);
        expect(wrapper.emitted('change').length).toBe(2);
        expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
        wrapper.unmount();
    });

    test('移除后收到 error 回调：不 emit error', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        await chooseFiles(wrapper, [createFile('a.txt')]);
        await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
        const xhr = MockXHR.instances[0] as any;
        xhr.onerror();
        await settle();
        expect(wrapper.emitted('error')).toBe(undefined);
        expect(wrapper.emitted('change').length).toBe(2);
        wrapper.unmount();
    });

    test('多文件并发上传时移除其一仅中止该文件的请求', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload', multiple: true },
        });
        await chooseFiles(wrapper, [
            createFile('a.txt'),
            createFile('b.txt'),
        ]);
        expect(MockXHR.instances.length).toBe(2);
        // 移除 a.txt：只有第一个请求被 abort，b.txt 继续上传
        const closeIcons = wrapper.findAll(`.${prefixCls}-list-icons-close`);
        expect(closeIcons.length).toBe(2);
        await closeIcons[0].trigger('click');
        await nextTick();
        expect(MockXHR.instances[0].abort).toHaveBeenCalledTimes(1);
        expect(MockXHR.instances[1].abort).not.toHaveBeenCalled();
        // 移除后回调守卫：迟到的 success 只会命中存活的 b.txt
        const xhrB = MockXHR.instances[1] as any;
        xhrB.status = 200;
        xhrB.responseText = '{"ok":1}';
        xhrB.onload();
        await settle();
        const removed = wrapper.emitted('remove');
        expect(removed.length).toBe(1);
        expect(removed[0][0].file.name).toBe('a.txt');
        const successes = wrapper.emitted('success');
        expect(successes.length).toBe(1);
        expect(successes[0][0].file.name).toBe('b.txt');
        // 列表只剩 b.txt
        const items = wrapper.findAll(`.${prefixCls}-list-item`);
        expect(items.length).toBe(1);
        expect(items[0].text()).toContain('b.txt');
        wrapper.unmount();
    });

    test('beforeUpload 未决期间清空列表，迟到的不通过结果不会误发 remove', async () => {
        let resolveBefore: (v: boolean) => void;
        const changeSpy = vi.fn();
        const removeSpy = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            ref: 'uploadRef',
                            action: '/upload',
                            beforeUpload: () =>
                                new Promise<boolean>((resolve) => {
                                    resolveBefore = resolve;
                                }),
                            onChange: changeSpy,
                            onRemove: removeSpy,
                        });
                },
            }),
        );
        const uploadRef = wrapper.vm.$refs.uploadRef as any;
        uploadRef.addFile(createFile('a.txt'));
        await nextTick();
        // 文件已入列
        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(
            wrapper.findAll(`.${prefixCls}-list-item`).length,
        ).toBe(1);
        // 上传前置校验未决时用户清空列表
        uploadRef.clearFiles();
        await nextTick();
        expect(
            wrapper.findAll(`.${prefixCls}-list-item`).length,
        ).toBe(0);
        resolveBefore(false);
        await settle();
        // 守卫生效：不会对已清空的列表误发 remove，也不会发请求
        expect(removeSpy).not.toHaveBeenCalled();
        expect(changeSpy).toHaveBeenCalledTimes(1);
        expect(MockXHR.instances.length).toBe(0);
        wrapper.unmount();
    });
});

// ---------------- beforeUpload / beforeRemove 三态 -------------------

describe('beforeUpload / beforeRemove 返回值三态', () => {
    test('beforeRemove 返回非 false 的普通值时照常删除文件', async () => {
        const wrapper = mount(Upload, {
            props: {
                fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
                beforeRemove: () => undefined,
            },
        });
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
        await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
        expect(wrapper.emitted('remove').length).toBe(1);
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
    });

    test('beforeRemove 为真值非函数时按防御逻辑跳过删除且不崩溃', async () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = mount(Upload, {
            props: {
                fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
                beforeRemove: true,
            } as any,
        });
        await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
        // 非 function 的 beforeRemove 不执行任何删除分支：文件保留、无事件
        expect(wrapper.emitted('remove')).toBe(undefined);
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('beforeUpload 返回 File 时实际上传的是转换后的文件', async () => {
        const appendSpy = vi.spyOn(FormData.prototype, 'append');
        const wrapper = mount(Upload, {
            props: {
                action: '/upload',
                beforeUpload: () =>
                    new File(['converted'], 'converted.txt', {
                        type: 'text/plain',
                    }),
            },
        });
        await chooseFiles(wrapper, [createFile('a.txt')]);
        expect(MockXHR.instances.length).toBe(1);
        // FormData 中是转换后的文件名
        const fileAppend = appendSpy.mock.calls.find((c) => c[0] === 'file');
        expect(fileAppend[2]).toBe('converted.txt');
        const xhr = MockXHR.instances[0] as any;
        xhr.status = 200;
        xhr.responseText = '{"ok":1}';
        xhr.onload();
        await settle();
        expect(wrapper.emitted('success').length).toBe(1);
        // 转换文件继承了原始 uid，列表项状态正常流转为 success
        expect(wrapper.emitted('change').length).toBe(2);
        expect(wrapper.emitted('change')[1][0].file.status).toBe('success');
        expect(
            wrapper.find(`.${prefixCls}-list-item`).classes(),
        ).toContain('is-success');
        appendSpy.mockRestore();
    });

    test('beforeUpload 返回 true 时按原文件继续上传', async () => {
        const appendSpy = vi.spyOn(FormData.prototype, 'append');
        const wrapper = mount(Upload, {
            props: {
                action: '/upload',
                beforeUpload: () => true,
            },
        });
        await chooseFiles(wrapper, [createFile('a.txt')]);
        expect(MockXHR.instances.length).toBe(1);
        const fileAppend = appendSpy.mock.calls.find((c) => c[0] === 'file');
        expect(fileAppend[2]).toBe('a.txt');
        const xhr = MockXHR.instances[0] as any;
        xhr.status = 200;
        xhr.responseText = '{"ok":1}';
        xhr.onload();
        await settle();
        expect(wrapper.emitted('success').length).toBe(1);
        expect(wrapper.emitted('change')[1][0].file.name).toBe('a.txt');
        appendSpy.mockRestore();
    });

    test('转换文件拷贝期间原文件属性被移除时跳过该属性且不崩溃', async () => {
        // 防御分支锁定：拷贝遍历的是原始 rawFile，Object.keys 快照后
        // 属性消失（getter 副作用删除），hasOwn 守卫跳过该属性，上传照常进行
        const origin = createFile('origin.txt');
        // getter 先注册（key 顺序在前），拷贝进行到 spy 时删除 origin.custom，
        // 使后续 custom 迭代命中 hasOwn === false 的跳过分支
        Object.defineProperty(origin, 'spy', {
            enumerable: true,
            configurable: true,
            get() {
                delete (origin as any).custom;
                return 'x';
            },
        });
        (origin as any).custom = 'c';
        const appendSpy = vi.spyOn(FormData.prototype, 'append');
        const wrapper = mount(Upload, {
            props: {
                action: '/upload',
                beforeUpload: () =>
                    new File(['converted'], 'converted.txt', {
                        type: 'text/plain',
                    }),
            },
        });
        await chooseFiles(wrapper, [origin]);
        expect(MockXHR.instances.length).toBe(1);
        // 上传的是转换后的文件，且原文件的属性被拷贝过去
        const fileAppend = appendSpy.mock.calls.find((c) => c[0] === 'file');
        expect(fileAppend[2]).toBe('converted.txt');
        expect((fileAppend[1] as any).spy).toBe('x');
        const xhr = MockXHR.instances[0] as any;
        xhr.status = 200;
        xhr.responseText = '{"ok":1}';
        xhr.onload();
        await settle();
        expect(wrapper.emitted('success').length).toBe(1);
        appendSpy.mockRestore();
    });
});

// ---------------- fileList 规范化 -------------------

describe('fileList 规范化与暴露方法', () => {
    test('fileList 传非数组时被规范化为空数组且不崩溃', async () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = mount(Upload, {
            props: { fileList: 'oops' as any },
        });
        await nextTick();
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(0);
        expect(wrapper.emitted('update:fileList')).toBeTruthy();
        expect(wrapper.emitted('update:fileList')[0][0]).toEqual([]);
        warnSpy.mockRestore();
    });

    test('clearFiles 抛出 update:fileList 且不经过 beforeRemove', async () => {
        const beforeRemove = vi.fn(() => false);
        const onUpdateFileList = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            'ref': 'uploadRef',
                            'fileList': [
                                { name: 'a.txt', uid: 1, status: 'success' },
                            ],
                            beforeRemove,
                            'onUpdate:fileList': onUpdateFileList,
                        });
                },
            }),
        );
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
        (wrapper.vm.$refs.uploadRef as any).clearFiles();
        await settle();
        // clearFiles 直接清空：不触发 beforeRemove 校验（现状锁定）
        expect(beforeRemove).not.toHaveBeenCalled();
        // update:fileList 抛出空列表供 v-model 同步
        expect(onUpdateFileList).toHaveBeenCalledTimes(1);
        expect(onUpdateFileList.mock.calls[0][0]).toEqual([]);
        expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
        wrapper.unmount();
    });

    test('addFile(null) 为安全空操作', async () => {
        const onChange = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            ref: 'uploadRef',
                            action: '/upload',
                            onChange,
                        });
                },
            }),
        );
        expect(() =>
            (wrapper.vm.$refs.uploadRef as any).addFile(null),
        ).not.toThrow();
        await settle();
        expect(onChange).not.toHaveBeenCalled();
        expect(MockXHR.instances.length).toBe(0);
        expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
    });

    test('addFile 在 multipleLimit 限额内正常上传', async () => {
        const onExceed = vi.fn();
        const onChange = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            ref: 'uploadRef',
                            action: '/upload',
                            multipleLimit: 2,
                            fileList: [
                                { name: 'exist.txt', uid: 1, status: 'success' },
                            ],
                            onExceed,
                            onChange,
                        });
                },
            }),
        );
        (wrapper.vm.$refs.uploadRef as any).addFile(createFile('added.txt'));
        await settle();
        expect(onExceed).not.toHaveBeenCalled();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].file.name).toBe('added.txt');
        expect(MockXHR.instances.length).toBe(1);
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(2);
    });

    test('addFile 超出 multipleLimit 时拦截并 emit exceed', async () => {
        const onExceed = vi.fn();
        const onChange = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            ref: 'uploadRef',
                            action: '/upload',
                            multipleLimit: 1,
                            fileList: [
                                { name: 'exist.txt', uid: 1, status: 'success' },
                            ],
                            onExceed,
                            onChange,
                        });
                },
            }),
        );
        (wrapper.vm.$refs.uploadRef as any).addFile(createFile('added.txt'));
        await settle();
        expect(onExceed).toHaveBeenCalledTimes(1);
        expect(onExceed.mock.calls[0][0].files.length).toBe(1);
        expect(onExceed.mock.calls[0][0].files[0].name).toBe('added.txt');
        expect(onChange).not.toHaveBeenCalled();
        expect(MockXHR.instances.length).toBe(0);
        // 列表仍只有原文件
        const items = wrapper.findAll(`.${prefixCls}-list-item`);
        expect(items.length).toBe(1);
        expect(items[0].text()).toContain('exist.txt');
    });

    test('removeFile(null) 为安全空操作', async () => {
        const onRemove = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            ref: 'uploadRef',
                            fileList: [
                                { name: 'a.txt', uid: 1, status: 'success' },
                            ],
                            onRemove,
                        });
                },
            }),
        );
        expect(() =>
            (wrapper.vm.$refs.uploadRef as any).removeFile(null),
        ).not.toThrow();
        await nextTick();
        expect(onRemove).not.toHaveBeenCalled();
        expect(wrapper.emitted('remove')).toBe(undefined);
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
    });

    test('clearFiles 后宿主原地追加 fileList，补齐缺失的 uid/status 并渲染', async () => {
        // 真实场景：宿主持有 reactive 列表、不监听 update:fileList。
        // clearFiles 后内部数组与 props.fileList 内容分叉，
        // 宿主再原地 push 时 deep watch 触发规范化（uid/status 兜底）
        const externalList = reactive([
            { name: 'a.txt', uid: 1, status: 'success' },
        ]);
        const onUpdateFileList = vi.fn();
        const wrapper = mount(
            defineComponent({
                setup() {
                    return () =>
                        h(Upload, {
                            'ref': 'uploadRef',
                            'fileList': externalList,
                            'onUpdate:fileList': onUpdateFileList,
                        });
                },
            }),
        );
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
        // 清空后内部数组与外部列表分叉
        (wrapper.vm.$refs.uploadRef as any).clearFiles();
        await nextTick();
        expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(0);
        expect(onUpdateFileList).toHaveBeenCalledTimes(1);
        // 宿主原地追加缺失 uid/status 的条目
        externalList.push({ name: 'appended.txt' });
        await nextTick();
        // 规范化分支生效：update:fileList 抛出补齐后的列表
        expect(onUpdateFileList).toHaveBeenCalledTimes(2);
        const normalized = onUpdateFileList.mock.calls[1][0];
        expect(normalized.length).toBe(2);
        // 已有条目保留原 uid；新条目自动生成 uid 并兜底 status
        expect(normalized[0].uid).toBe(1);
        const appended = normalized[1];
        expect(appended.name).toBe('appended.txt');
        expect(appended.uid).toBeTruthy();
        expect(appended.status).toBe('success');
        // 渲染：appended 以 is-success 展示
        const items = wrapper.findAll(`.${prefixCls}-list-item`);
        expect(items.length).toBe(2);
        expect(items[1].classes()).toContain('is-success');
        expect(items[1].text()).toContain('appended.txt');
    });
});

// 等待可能存在的异步尾巴，避免用例间串扰
afterEach(async () => {
    await wait(10);
});
