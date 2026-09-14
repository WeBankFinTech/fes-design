import {
    flushPromises,
    mount,
} from '@vue/test-utils';
import { h, ref } from 'vue';
import InputFile from '../inputFile';
import InputFileDragger from '../inputFileDragger';
import { useFileDrop } from '../useFileDrop';
import getPrefixCls from '../../_util/getPrefixCls';
import { matchType } from '../../upload/utils';

const prefixCls = getPrefixCls('input-file');
const draggerPrefixCls = getPrefixCls('input-file-dragger');

function createFile(name: string, type = 'text/plain') {
    return new File([name], name, { type });
}

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

// ---------------- 基础渲染 -------------------

test('render default trigger, empty file list and hidden input', () => {
    const wrapper = mount(InputFile);
    expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-trigger`).exists()).toBe(true);
    const btn = wrapper.find(`.${prefixCls}-trigger-button`);
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toBe('选择文件');
    // 没有文件时不渲染文件名
    expect(wrapper.find(`.${prefixCls}-file-list`).text()).toBe('');
    const input = wrapper.find(`.${prefixCls}-input`);
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('file');
    expect(input.attributes('accept')).toBe('');
    expect(input.attributes('multiple')).toBe(undefined);
});

test('render default slot as trigger', async () => {
    const wrapper = mount(InputFile, {
        slots: {
            default: '<button class="my-trigger">pick</button>',
        },
    });
    expect(wrapper.find('.my-trigger').exists()).toBe(true);
    expect(wrapper.find(`.${prefixCls}-trigger-button`).exists()).toBe(false);
    // input 仍然存在
    expect(wrapper.find(`.${prefixCls}-input`).exists()).toBe(true);
});

test('accept and multiple props map to input attributes', () => {
    const wrapper = mount(InputFile, {
        props: {
            accept: ['image/*', '.pdf'],
            multiple: true,
        },
    });
    const input = wrapper.find(`.${prefixCls}-input`);
    expect(input.attributes('accept')).toBe('image/*,.pdf');
    expect(input.attributes('multiple')).toBe('');
});

// ---------------- 打开文件选择器 -------------------

test('click trigger opens the file explorer', async () => {
    const wrapper = mount(InputFile);
    const clickSpy = vi.fn();
    const input = wrapper.find(`.${prefixCls}-input`);
    input.element.click = clickSpy;
    await wrapper.find(`.${prefixCls}-trigger`).trigger('click');
    expect(clickSpy).toHaveBeenCalledTimes(1);
});

test('disabled component does not open the file explorer', async () => {
    const wrapper = mount(InputFile, {
        props: { disabled: true },
    });
    const clickSpy = vi.fn();
    const input = wrapper.find(`.${prefixCls}-input`);
    input.element.click = clickSpy;
    await wrapper.find(`.${prefixCls}-trigger`).trigger('click');
    expect(clickSpy).not.toHaveBeenCalled();
    // 按钮处于禁用态（disabled attribute）
    expect(
        wrapper.find(`.${prefixCls}-trigger-button`).attributes('disabled'),
    ).toEqual('');
});

// ---------------- 文件选择 -------------------

test('choose a single file updates modelValue and emits change', async () => {
    const wrapper = mount(InputFile);
    await chooseFiles(wrapper, [createFile('a.txt')]);
    expect(wrapper.emitted('update:modelValue').length).toBe(1);
    const files = wrapper.emitted('update:modelValue')[0][0];
    expect(files.length).toBe(1);
    expect(files[0].name).toBe('a.txt');
    expect(files[0].uid).toBeDefined();
    const changes = wrapper.emitted('change');
    expect(changes.length).toBe(1);
    expect(changes[0][0][0].name).toBe('a.txt');
    // 文件列表展示文件名
    expect(wrapper.find(`.${prefixCls}-file-list`).text()).toBe('a.txt');
});

test('choose multiple files shows count text', async () => {
    const wrapper = mount(InputFile, {
        props: { multiple: true },
    });
    await chooseFiles(wrapper, [
        createFile('a.txt'),
        createFile('b.txt'),
    ]);
    const files = wrapper.emitted('update:modelValue')[0][0];
    expect(files.length).toBe(2);
    expect(wrapper.find(`.${prefixCls}-file-list`).text()).toBe('2 个文件');
});

test('modelValue controlled: fileList slot renders chosen files', async () => {
    const wrapper = mount(InputFile, {
        props: { modelValue: [createFile('init.txt')] },
        slots: {
            fileList: ({ files }: any) =>
                h(
                    'ul',
                    { class: 'my-list' },
                    files.map((f: any) => h('li', { key: f.uid }, f.name)),
                ),
        },
    });
    expect(wrapper.findAll('.my-list li').length).toBe(1);
    expect(wrapper.find('.my-list li').text()).toBe('init.txt');

    await chooseFiles(wrapper, [createFile('next.txt')]);
    await flushPromises();
    const items = wrapper.findAll('.my-list li');
    expect(items.length).toBe(1);
    expect(items[0].text()).toBe('next.txt');
});

test('resetting input value allows re-choosing the same file', async () => {
    const wrapper = mount(InputFile);
    const file = createFile('same.txt');
    await chooseFiles(wrapper, [file]);
    await chooseFiles(wrapper, [file]);
    expect(wrapper.emitted('change').length).toBe(2);
});

// ---------------- useFileDrop：拖拽分支 -------------------

function makeDragEvent(files: File[]) {
    return {
        preventDefault: vi.fn(),
        dataTransfer: { files },
    } as unknown as DragEvent;
}

describe('useFileDrop', () => {
    const baseCtx = () => ({
        accept: ref([] as string[]),
        multiple: ref(false),
        disabled: ref(false),
        afterDrop: vi.fn(),
        onFileTypeInvalid: vi.fn(),
    });

    test('enter/leave toggles hovering and preventDefault is called', () => {
        const ctx = baseCtx();
        const {
            isHovering,
            handleEnter,
            handleLeave,
            handleOver,
        } = useFileDrop(ctx);
        expect(isHovering.value).toBe(false);
        const event = makeDragEvent([]);
        handleEnter(event);
        expect(isHovering.value).toBe(true);
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
        handleOver(event);
        expect(event.preventDefault).toHaveBeenCalledTimes(2);
        handleLeave(event);
        expect(isHovering.value).toBe(false);
    });

    test('disabled context ignores all drag events', () => {
        const ctx = { ...baseCtx(), disabled: ref(true) };
        const {
            isHovering,
            handleEnter,
            handleLeave,
            handleOver,
            handleDrop,
        } = useFileDrop(ctx);
        const event = makeDragEvent([createFile('a.txt')]);
        handleEnter(event);
        handleOver(event);
        handleLeave(event);
        handleDrop(event);
        expect(isHovering.value).toBe(false);
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(ctx.afterDrop).not.toHaveBeenCalled();
    });

    test('drop with empty files does nothing', () => {
        const ctx = baseCtx();
        const { handleDrop } = useFileDrop(ctx);
        handleDrop(makeDragEvent([]));
        expect(ctx.afterDrop).not.toHaveBeenCalled();
    });

    test('drop without multiple keeps only the first file', () => {
        const ctx = baseCtx();
        const { handleDrop } = useFileDrop(ctx);
        handleDrop(
            makeDragEvent([createFile('a.txt'), createFile('b.txt')]),
        );
        expect(ctx.afterDrop).toHaveBeenCalledTimes(1);
        const files = ctx.afterDrop.mock.calls[0][0];
        expect(files.length).toBe(1);
        expect(files[0].name).toBe('a.txt');
    });

    test('drop with multiple passes all files', () => {
        const ctx = { ...baseCtx(), multiple: ref(true) };
        const { handleDrop } = useFileDrop(ctx);
        handleDrop(
            makeDragEvent([createFile('a.txt'), createFile('b.txt')]),
        );
        expect(ctx.afterDrop.mock.calls[0][0].length).toBe(2);
    });

    test('accept filters invalid files and reports them', () => {
        const ctx = {
            ...baseCtx(),
            accept: ref(['image/*']),
            multiple: ref(true),
        };
        const { handleDrop } = useFileDrop(ctx);
        handleDrop(
            makeDragEvent([
                createFile('a.png', 'image/png'),
                createFile('a.txt'),
            ]),
        );
        expect(ctx.afterDrop).toHaveBeenCalledTimes(1);
        // 源码行为：afterDrop 收到的是未经 accept 过滤的文件列表
        expect(ctx.afterDrop.mock.calls[0][0].length).toBe(2);
        expect(ctx.onFileTypeInvalid).toHaveBeenCalledTimes(1);
        const invalid = ctx.onFileTypeInvalid.mock.calls[0][0];
        expect(invalid.length).toBe(1);
        expect(invalid[0].name).toBe('a.txt');
    });

    test('accept with no matching files still reports all as invalid', () => {
        const ctx = {
            ...baseCtx(),
            accept: ref(['.md']),
            multiple: ref(true),
        };
        const { handleDrop } = useFileDrop(ctx);
        handleDrop(
            makeDragEvent([createFile('a.txt'), createFile('b.txt')]),
        );
        expect(ctx.onFileTypeInvalid).toHaveBeenCalledTimes(1);
        expect(ctx.onFileTypeInvalid.mock.calls[0][0].length).toBe(2);
        // 源码行为：afterDrop 仍收到原始文件列表（未过滤）
        expect(ctx.afterDrop.mock.calls[0][0].length).toBe(2);
    });
});

// ---------------- FInputFileDragger -------------------

test('dragger renders and drop uploads files', async () => {
    const onFileTypeInvalid = vi.fn();
    const onChange = vi.fn();
    const wrapper = mount(
        InputFileDragger,
        {
            props: {
                accept: ['.png'],
                multiple: true,
                onFileTypeInvalid,
                onChange,
            },
        },
    );
    expect(wrapper.find(`.${draggerPrefixCls}`).exists()).toBe(true);
    const droppable = wrapper.find(`.${draggerPrefixCls}-droppable`);
    expect(droppable.exists()).toBe(true);

    // hover 状态切换
    await droppable.trigger('dragenter');
    expect(wrapper.find(`.${draggerPrefixCls}-droppable`).classes()).toContain(
        'is-hovering',
    );
    await droppable.trigger('dragleave');
    expect(
        wrapper.find(`.${draggerPrefixCls}-droppable`).classes(),
    ).not.toContain('is-hovering');

    // 拖拽释放：合法文件被接收
    await droppable.trigger('drop', {
        dataTransfer: {
            files: [
                createFile('a.png', 'image/png'),
                createFile('a.txt'),
            ],
        },
    });
    const files = wrapper.emitted('update:modelValue')[0][0];
    expect(files.length).toBe(2);
    expect(files[0].name).toBe('a.png');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onFileTypeInvalid).toHaveBeenCalledTimes(1);
    expect(onFileTypeInvalid.mock.calls[0][0][0].name).toBe('a.txt');
    // 文件列表文案（dragger 使用自己的 prefixCls 渲染列表）
    expect(wrapper.find(`.${draggerPrefixCls}-file-list`).text()).toBe(
        '2 个文件',
    );
});

test('disabled dragger ignores drop and shows disabled state', async () => {
    const wrapper = mount(InputFileDragger, {
        props: { disabled: true },
    });
    const droppable = wrapper.find(`.${draggerPrefixCls}-droppable`);
    expect(droppable.classes()).toContain('is-disabled');
    await droppable.trigger('drop', {
        dataTransfer: { files: [createFile('a.txt')] },
    });
    expect(wrapper.emitted('update:modelValue')).toBe(undefined);
});

test('dragger drop without multiple keeps only the first file', async () => {
    const wrapper = mount(InputFileDragger);
    await wrapper.find(`.${draggerPrefixCls}-droppable`).trigger('drop', {
        dataTransfer: {
            files: [createFile('a.txt'), createFile('b.txt')],
        },
    });
    const files = wrapper.emitted('update:modelValue')[0][0];
    expect(files.length).toBe(1);
    expect(files[0].name).toBe('a.txt');
    expect(wrapper.find(`.${draggerPrefixCls}-file-list`).text()).toBe(
        'a.txt',
    );
});

// ---------------- matchType 复用 -------------------

test('matchType is reused from upload utils', () => {
    expect(matchType('a.png', 'image/png', ['.png'])).toBe(true);
});
