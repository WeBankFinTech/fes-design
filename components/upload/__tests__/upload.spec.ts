import {
    flushPromises,
    mount,
} from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import Upload from '../upload';
import UploadDragger from '../uploadDragger';
import { matchType } from '../utils';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('upload');

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
    vi.stubGlobal('XMLHttpRequest', MockXHR);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

// ---------------- helpers -------------------

async function chooseFiles(
    wrapper: any,
    files: File[],
    selector = `.${prefixCls}-input`,
) {
    const input = wrapper.find(selector);
    Object.defineProperty(input.element, 'files', {
        value: files,
        configurable: true,
    });
    await input.trigger('change');
}

function mountHost(template: string, setupReturn: Record<string, any> = {}) {
    return mount(
        defineComponent({
            components: { Upload, UploadDragger },
            setup() {
                return setupReturn;
            },
            template,
        }),
    );
}

function createFile(name: string, type = 'text/plain') {
    return new File([name], name, { type });
}

// ---------------- 渲染 -------------------

test('render default trigger, hidden input and list container', () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-trigger-default`).text()).toBe(
        '上传文件',
    );
    const input = wrapper.find(`.${prefixCls}-input`);
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('file');
    expect(input.attributes('name')).toBe('file');
    expect(input.attributes('accept')).toBe('');
    expect(input.attributes('multiple')).toBe(undefined);
    expect(wrapper.find(`.${prefixCls}-list`).exists()).toBe(true);
});

test('render custom trigger slot', () => {
    const wrapper = mount(Upload, {
        slots: {
            default: '<div class="my-trigger">click me</div>',
        },
    });
    expect(wrapper.find('.my-trigger').exists()).toBe(true);
    expect(wrapper.find('.my-trigger').text()).toBe('click me');
    expect(wrapper.find(`.${prefixCls}-trigger-default`).exists()).toBe(false);
    // input 仍然存在
    expect(wrapper.find(`.${prefixCls}-input`).exists()).toBe(true);
});

test('accept and multiple props map to input attributes', () => {
    const wrapper = mount(Upload, {
        props: {
            accept: ['image/png', '.pdf'],
            multiple: true,
            name: 'attachment',
        },
    });
    const input = wrapper.find(`.${prefixCls}-input`);
    expect(input.attributes('accept')).toBe('image/png,.pdf');
    expect(input.attributes('multiple')).toBe('');
    expect(input.attributes('name')).toBe('attachment');
});

test('fileList prop renders list items with status class', () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [
                { name: 'a.txt', uid: 1, status: 'success' },
                { name: 'b.txt', uid: 2, status: 'error' },
            ],
        },
    });
    const items = wrapper.findAll(`.${prefixCls}-list-item`);
    expect(items.length).toBe(2);
    expect(items[0].classes()).toContain('is-success');
    expect(items[0].text()).toContain('a.txt');
    expect(items[1].classes()).toContain('is-error');
});

test('file slot customizes file item rendering', () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
        },
        slots: {
            file: ({ file }: any) =>
                h('span', { class: 'my-file-name' }, `custom-${file.name}`),
        },
    });
    expect(wrapper.find('.my-file-name').text()).toBe('custom-a.txt');
    // 默认文件名节点被替换
    expect(wrapper.find(`.${prefixCls}-list-name`).exists()).toBe(false);
});

test('fileList slot customizes the whole list', () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [
                { name: 'a.txt', uid: 1, status: 'success' },
                { name: 'b.txt', uid: 2, status: 'success' },
            ],
        },
        slots: {
            fileList: ({ uploadFiles }: any) =>
                h(
                    'div',
                    { class: 'my-file-list' },
                    uploadFiles.map((f: any) => h('span', { key: f.uid }, f.name)),
                ),
        },
    });
    expect(wrapper.find('.my-file-list').exists()).toBe(true);
    expect(wrapper.findAll('.my-file-list span').length).toBe(2);
    expect(wrapper.find(`.${prefixCls}-list`).exists()).toBe(false);
});

test('showFileList false hides the list', () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
            showFileList: false,
        },
    });
    expect(wrapper.find(`.${prefixCls}-list`).exists()).toBe(false);
});

test('disabled upload does not open file explorer and hides remove icon', async () => {
    const wrapper = mount(Upload, {
        props: {
            disabled: true,
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
        },
    });
    const clickSpy = vi.fn();
    const input = wrapper.find(`.${prefixCls}-input`);
    input.element.click = clickSpy;
    await wrapper.find(`.${prefixCls}`).trigger('click');
    expect(clickSpy).not.toHaveBeenCalled();
    expect(wrapper.find(`.${prefixCls}-list-icons-close`).exists()).toBe(false);
});

// ---------------- 文件选择 -------------------

test('choose files without action: file added then removed with error log', async () => {
    const errorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    const wrapper = mount(Upload);
    await chooseFiles(wrapper, [createFile('a.txt')]);
    // onStart 触发一次 change（status ready）
    const changes = wrapper.emitted('change');
    expect(changes.length).toBe(2);
    expect(changes[0][0].file.name).toBe('a.txt');
    expect(changes[0][0].file.status).toBe('ready');
    // 无 action 时上传报错并移除文件
    expect(wrapper.emitted('remove').length).toBe(1);
    expect(changes[1][0].fileList.length).toBe(0);
    expect(
        errorSpy.mock.calls.some((args) =>
            String(args[0]).includes('action'),
        ),
    ).toBe(true);
});

test('multiple false only uploads the first file', async () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    await chooseFiles(wrapper, [
        createFile('a.txt'),
        createFile('b.txt'),
    ]);
    const changes = wrapper.emitted('change');
    expect(changes.length).toBe(1);
    expect(changes[0][0].file.name).toBe('a.txt');
    expect(MockXHR.instances.length).toBe(1);
});

test('multipleLimit exceeded emits exceed without uploading', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            multiple: true,
            multipleLimit: 2,
        },
    });
    await chooseFiles(wrapper, [
        createFile('a.txt'),
        createFile('b.txt'),
        createFile('c.txt'),
    ]);
    const exceeds = wrapper.emitted('exceed');
    expect(exceeds.length).toBe(1);
    expect(exceeds[0][0].files.length).toBe(3);
    expect(wrapper.emitted('change')).toBe(undefined);
    expect(MockXHR.instances.length).toBe(0);
});

// ---------------- 上传流程 -------------------

test('upload success: request sent and events emitted', async () => {
    const appendSpy = vi.spyOn(FormData.prototype, 'append');
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            data: { extra: '1' },
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);

    // onStart 已发出 change，此时文件 status 为 ready（在 onload 前断言，
    // 因为 emitted 记录的 file 对象是同一个引用，后续状态会被覆写）
    let changes = wrapper.emitted('change');
    expect(changes.length).toBe(1);
    expect(changes[0][0].file.status).toBe('ready');

    const xhr = MockXHR.instances[0] as any;
    expect(xhr.open).toHaveBeenCalledWith('post', '/upload', true);
    expect(xhr.send).toHaveBeenCalledTimes(1);
    // formData: data 字段 + 文件字段
    const appendCalls = appendSpy.mock.calls;
    expect(appendCalls.some((c) => c[0] === 'extra' && c[1] === '1')).toBe(
        true,
    );
    const fileAppend = appendCalls.find((c) => c[0] === 'file');
    expect(fileAppend[2]).toBe('a.txt');

    xhr.status = 200;
    xhr.responseText = '{"ok":1}';
    xhr.onload();

    await flushPromises();
    const successes = wrapper.emitted('success');
    expect(successes.length).toBe(1);
    expect(successes[0][0].response).toEqual({ ok: 1 });
    changes = wrapper.emitted('change');
    expect(changes.length).toBe(2);
    // 同一个文件项：状态已被更新为 success
    expect(changes[1][0].file.status).toBe('success');
    expect(changes[1][0].file.name).toBe('a.txt');
    expect(wrapper.find(`.${prefixCls}-list-item`).classes()).toContain(
        'is-success',
    );
    appendSpy.mockRestore();
});

test('upload progress updates percentage and progress bar', async () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;

    xhr.upload.onprogress({ loaded: 30, total: 100 });
    await nextTick();
    const progresses = wrapper.emitted('progress');
    expect(progresses.length).toBe(1);
    expect(progresses[0][0].event.percent).toBe(30);
    const progressInner = wrapper.find(`.${prefixCls}-list-progress-inner`);
    expect(progressInner.exists()).toBe(true);
    expect(progressInner.attributes('style')).toContain('30%');

    // total 为 0 时 percent 兜底为 0
    xhr.upload.onprogress({ loaded: 0, total: 0 });
    await nextTick();
    expect(wrapper.emitted('progress').length).toBe(2);
    expect(wrapper.find(`.${prefixCls}-list-progress-inner`).attributes(
        'style',
    )).toContain('0%');
});

test('non-2xx response triggers error with responseText message', async () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    xhr.status = 500;
    xhr.responseText = 'server error';
    xhr.onload();
    await nextTick();

    const errors = wrapper.emitted('error');
    expect(errors.length).toBe(1);
    expect(errors[0][0].error.message).toBe('server error');
    expect(errors[0][0].error.status).toBe(500);
    expect(errors[0][0].error.method).toBe('post');
    expect(wrapper.emitted('change')[1][0].file.status).toBe('error');
    expect(wrapper.find(`.${prefixCls}-list-item`).classes()).toContain(
        'is-error',
    );
});

test('xhr.onerror triggers error with default message', async () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    xhr.onerror();

    const errors = wrapper.emitted('error');
    expect(errors.length).toBe(1);
    expect(errors[0][0].error.message).toBe('fail to post /upload 0');
    expect(wrapper.emitted('change')[1][0].file.status).toBe('error');
});

test('transformResponse maps the success response', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            transformResponse: () => ({ parsed: true }),
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    xhr.status = 200;
    xhr.responseText = '{"raw":1}';
    xhr.onload();

    expect(wrapper.emitted('success')[0][0].response).toEqual({ parsed: true });
});

test('transformResponse throwing triggers error', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            transformResponse: () => {
                throw new Error('boom');
            },
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    xhr.status = 200;
    xhr.responseText = '{"raw":1}';
    xhr.onload();

    const errors = wrapper.emitted('error');
    expect(errors.length).toBe(1);
    expect(errors[0][0].error.message).toBe('boom');
});

test('non-JSON response body is passed through as text', async () => {
    const wrapper = mount(Upload, {
        props: { action: '/upload' },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    xhr.status = 200;
    xhr.responseText = 'plain text';
    xhr.onload();

    expect(wrapper.emitted('success')[0][0].response).toBe('plain text');
});

test('headers, withCredentials and timeout pass to xhr', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            headers: { 'x-token': 'abc', 'x-null': null },
            withCredentials: true,
            timeout: 3000,
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    const xhr = MockXHR.instances[0] as any;
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('x-token', 'abc');
    expect(xhr.setRequestHeader).not.toHaveBeenCalledWith('x-null', null);
    expect(xhr.withCredentials).toBe(true);
    expect(xhr.timeout).toBe(3000);
});

// ---------------- before-upload -------------------

test('beforeUpload returning false removes the file without uploading', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            beforeUpload: () => false,
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    expect(MockXHR.instances.length).toBe(0);
    expect(wrapper.emitted('remove').length).toBe(1);
    expect(wrapper.emitted('change')[1][0].fileList.length).toBe(0);
});

test('beforeUpload returning a Blob uploads converted File', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            beforeUpload: () => new Blob(['processed'], { type: 'text/plain' }),
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    expect(MockXHR.instances.length).toBe(1);
    const xhr = MockXHR.instances[0] as any;
    xhr.status = 200;
    xhr.responseText = '{"ok":1}';
    xhr.onload();
    await flushPromises();
    expect(wrapper.emitted('success').length).toBe(1);
    expect(wrapper.emitted('change')[1][0].file.status).toBe('success');
});

test('beforeUpload throwing removes the file without uploading', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            beforeUpload: () => {
                throw new Error('invalid');
            },
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    expect(MockXHR.instances.length).toBe(0);
    expect(wrapper.emitted('remove').length).toBe(1);
});

// ---------------- httpRequest -------------------

test('custom httpRequest (sync) is used instead of ajax', async () => {
    const httpRequest = vi.fn((options: any) => {
        options.onSuccess({ custom: true });
        return {};
    });
    const wrapper = mount(Upload, {
        props: { action: '/upload', httpRequest },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    expect(httpRequest).toHaveBeenCalledTimes(1);
    expect(httpRequest.mock.calls[0][0].action).toBe('/upload');
    expect(MockXHR.instances.length).toBe(0);
    expect(wrapper.emitted('success')[0][0].response).toEqual({ custom: true });
});

test('httpRequest returning a Promise resolves to success', async () => {
    const wrapper = mount(Upload, {
        props: {
            action: '/upload',
            httpRequest: () => Promise.resolve({ fromPromise: true }),
        },
    });
    await chooseFiles(wrapper, [createFile('a.txt')]);
    await flushPromises();
    expect(wrapper.emitted('success')[0][0].response).toEqual({
        fromPromise: true,
    });
});

// ---------------- listType picture-card -------------------

test('picture-card listType generates preview url', async () => {
    const original = (URL as any).createObjectURL;
    (URL as any).createObjectURL = vi.fn(() => 'blob:mock');
    try {
        const wrapper = mount(Upload, {
            props: {
                action: '/upload',
                listType: 'picture-card',
            },
        });
        await chooseFiles(wrapper, [createFile('a.png', 'image/png')]);
        expect(wrapper.emitted('change')[0][0].file.url).toBe('blob:mock');
    } finally {
        (URL as any).createObjectURL = original;
    }
});

// ---------------- 暴露方法 -------------------

// upload 是 fragment 根组件，且事件从孙组件发出时 wrapper.emitted 不记录，
// 因此用 render 函数宿主 + 显式事件回调来观测
test('expose clearFiles empties the list', async () => {
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
                        'onUpdate:fileList': onUpdateFileList,
                    });
            },
        }),
    );
    expect(wrapper.findAll(`.${prefixCls}-list-item`).length).toBe(1);
    (wrapper.vm.$refs.uploadRef as any).clearFiles();
    await nextTick();
    expect(onUpdateFileList).toHaveBeenCalledTimes(1);
    expect(onUpdateFileList.mock.calls[0][0]).toEqual([]);
    expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
});

test('expose addFile uploads the file', async () => {
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
    (wrapper.vm.$refs.uploadRef as any).addFile(createFile('added.txt'));
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].file.name).toBe('added.txt');
    expect(MockXHR.instances.length).toBe(1);
});

test('expose removeFile removes the item and emits remove', async () => {
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
    (wrapper.vm.$refs.uploadRef as any).removeFile({
        name: 'a.txt',
        uid: 1,
        status: 'success',
    });
    await nextTick();
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onRemove.mock.calls[0][0].file.name).toBe('a.txt');
    expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
});

// ---------------- 删除 -------------------

test('click close icon removes file and emits remove', async () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
        },
    });
    await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
    expect(wrapper.emitted('remove').length).toBe(1);
    expect(wrapper.emitted('remove')[0][0].file.name).toBe('a.txt');
    await nextTick();
    expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(false);
});

test('beforeRemove returning false keeps the file', async () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
            beforeRemove: () => false,
        },
    });
    await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
    expect(wrapper.emitted('remove')).toBe(undefined);
    expect(wrapper.find(`.${prefixCls}-list-item`).exists()).toBe(true);
});

test('beforeRemove returning a Promise removes after resolve', async () => {
    const wrapper = mount(Upload, {
        props: {
            fileList: [{ name: 'a.txt', uid: 1, status: 'success' }],
            beforeRemove: () => Promise.resolve(),
        },
    });
    await wrapper.find(`.${prefixCls}-list-icons-close`).trigger('click');
    await flushPromises();
    expect(wrapper.emitted('remove').length).toBe(1);
});

// ---------------- uploadDragger -------------------

test('dragger renders, toggles hover and handles valid/invalid drop', async () => {
    const onFileTypeInvalid = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(
        defineComponent({
            components: { Upload, UploadDragger },
            setup() {
                return () =>
                    h(
                        Upload,
                        {
                            action: '/upload',
                            accept: ['.png'],
                            multiple: true,
                            onChange,
                        },
                        {
                            default: () =>
                                h(UploadDragger, {
                                    onFileTypeInvalid,
                                }),
                        },
                    );
            },
        }),
    );
    const dragger = wrapper.find(`.${prefixCls}-dragger`);
    expect(dragger.exists()).toBe(true);
    expect(dragger.classes()).not.toContain('is-disabled');

    await dragger.trigger('dragenter');
    expect(wrapper.find(`.${prefixCls}-dragger`).classes()).toContain(
        'is-hovering',
    );
    await dragger.trigger('dragleave');
    expect(wrapper.find(`.${prefixCls}-dragger`).classes()).not.toContain(
        'is-hovering',
    );

    await dragger.trigger('drop', {
        dataTransfer: {
            files: [createFile('a.png', 'image/png'), createFile('a.txt')],
        },
    });
    // 符合类型的文件进入上传流程
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].file.name).toBe('a.png');
    expect(MockXHR.instances.length).toBe(1);
    // 不符合类型的文件回调 onFileTypeInvalid
    expect(onFileTypeInvalid).toHaveBeenCalledTimes(1);
    expect(onFileTypeInvalid.mock.calls[0][0].length).toBe(1);
    expect(onFileTypeInvalid.mock.calls[0][0][0].name).toBe('a.txt');
});

test('disabled dragger ignores drop', async () => {
    const wrapper = mountHost(
        `
        <Upload action="/upload" disabled>
            <UploadDragger />
        </Upload>
        `,
    );
    expect(wrapper.find(`.${prefixCls}-dragger`).classes()).toContain(
        'is-disabled',
    );
    await wrapper.find(`.${prefixCls}-dragger`).trigger('dragenter');
    expect(wrapper.find(`.${prefixCls}-dragger`).classes()).not.toContain(
        'is-hovering',
    );
    await wrapper.find(`.${prefixCls}-dragger`).trigger('drop', {
        dataTransfer: { files: [createFile('a.txt')] },
    });
    expect(wrapper.emitted('change')).toBe(undefined);
    expect(MockXHR.instances.length).toBe(0);
});

// ---------------- utils: matchType -------------------

describe('matchType', () => {
    test('suffix accept', () => {
        expect(matchType('a.PNG', 'image/png', ['.png'])).toBe(true);
        expect(matchType('a.png', 'image/png', ['.jpg'])).toBe(false);
        expect(matchType('a.png', 'image/png', [' .png '])).toBe(true);
    });

    test('mime type accept', () => {
        expect(matchType('a.png', 'image/png', ['image/png'])).toBe(true);
        expect(matchType('a.png', 'IMAGE/PNG', ['image/png'])).toBe(true);
        expect(matchType('a.jpg', 'image/jpeg', ['image/png'])).toBe(false);
    });

    test('wildcard accept', () => {
        expect(matchType('a.png', 'image/png', ['image/*'])).toBe(true);
        expect(matchType('a.png', 'image/png', ['*/*'])).toBe(true);
        expect(matchType('a.mp4', 'video/mp4', ['image/*'])).toBe(false);
    });

    test('invalid atom matches everything, empty accept matches nothing', () => {
        expect(matchType('a.png', 'image/png', ['png'])).toBe(true);
        expect(matchType('a.png', 'image/png', [''])).toBe(false);
        expect(matchType('a.png', 'image/png', [])).toBe(false);
    });
});

// ---------------- abort / error 链路 -------------------

describe('Upload abort 取消上传', () => {
    test('进行中的上传可被 abort（XHR.abort 被调）', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        const file = createFile('a.txt');
        await chooseFiles(wrapper, [file]);
        await nextTick();
        // 请求已发出但未响应（MockXHR send 不触发 onload）
        expect(MockXHR.instances.length).toBe(1);
        // 列表项渲染后移除触发 abort
        const removeIcon = wrapper.find(`.${prefixCls}-list-icons-close`);
        expect(removeIcon.exists()).toBe(true);
        await removeIcon.trigger('click');
        await nextTick();
        expect(MockXHR.instances[0].abort).toHaveBeenCalled();
        const removed = wrapper.emitted('remove');
        expect(removed).toBeTruthy();
        expect(removed!.length).toBe(1);
        wrapper.unmount();
    });

    test('onerror 回调置错误态并 emit error', async () => {
        const wrapper = mount(Upload, {
            props: { action: '/upload' },
        });
        const file = createFile('b.txt');
        await chooseFiles(wrapper, [file]);
        await nextTick();
        const xhr = MockXHR.instances[0];
        xhr.onerror?.(new ProgressEvent('error'));
        await nextTick();
        const errEvents = wrapper.emitted('error');
        expect(errEvents).toBeTruthy();
        expect(errEvents![0][0].file.name).toBe('b.txt');
        // 列表项状态为 error
        const item = wrapper.find(`.${prefixCls}-list-item`);
        expect(item.classes()).toContain('is-error');
        wrapper.unmount();
    });
});
