import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import FImage from '../image.vue';
import PreviewGroup from '../preview-group';
import getPrefixCls from '../../_util/getPrefixCls';

const previewCls = getPrefixCls('preview');
const imgCls = getPrefixCls('img');

// jsdom 不加载图片，按预设结果同步派发 load，让 FImage 进入注册/可预览状态
let imageLoadResult: 'success' | 'error' = 'success';
const nativeSrcDescriptor = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    'src',
) as PropertyDescriptor;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get(this: HTMLImageElement) {
        return nativeSrcDescriptor.get?.call(this);
    },
    ...nativeSrcDescriptor,
    configurable: true,
    set(this: HTMLImageElement, value: string) {
        if (nativeSrcDescriptor.set) {
            nativeSrcDescriptor.set.call(this, value);
        }
        if (imageLoadResult === 'success') {
            this.dispatchEvent(new Event('load'));
        } else {
            this.dispatchEvent(new Event('error'));
        }
    },
});

const OK_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAUwAOw==';

// 双图组：canvas src 即当前图，可断言切换语义
const mountGroup = (extra: Record<string, unknown> = {}) =>
    mount(PreviewGroup, {
        slots: {
            default: () => [
                h(FImage, { src: `${OK_SRC}?1`, preview: true, name: 'one.png' }),
                h(FImage, { src: `${OK_SRC}?2`, preview: true, name: 'two.png' }),
            ],
        },
        ...extra,
    });

const openPreview = async (
    wrapper: ReturnType<typeof mountGroup>,
    index: number,
) => {
    const inners = wrapper.findAll(`.${imgCls}__inner`);
    expect(inners.length).toBeGreaterThan(index);
    await inners[index].trigger('click');
    await nextTick();
    return document.body.querySelector(`.${previewCls}`) as HTMLElement;
};

const canvasSrc = () =>
    document.body.querySelector(`.${previewCls}__canvas`)?.getAttribute('src');

const clickArrow = async (dir: 'left' | 'right') => {
    (
        document.body.querySelector(`.${previewCls}__arrow-${dir}`) as HTMLElement
    ).click();
    await nextTick();
};

describe('FPreviewGroup 分支补全（上一张/下一张循环与守卫）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        document.body.style.overflow = '';
        imageLoadResult = 'success';
    });

    test('下一张：mid 列表内推进更新当前图 src 与 name', async () => {
        const wrapper = mountGroup();
        await nextTick();
        await openPreview(wrapper, 0);
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);

        // 65 行 true 路径：index(0) < keys.length-1(1) → 前进到第二张
        await clickArrow('right');
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        expect(
            document.body.querySelector(`.${previewCls}__name`)?.textContent,
        ).toContain('two.png');
        wrapper.unmount();
    });

    test('下一张到末尾回绕到第一张（65 行 false 路径）', async () => {
        const wrapper = mountGroup();
        await nextTick();
        await openPreview(wrapper, 1);
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        // index(1) = length-1(1) → else：回绕 setCurrent(keys[2-1-1]=keys[0])
        await clickArrow('right');
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        expect(
            document.body.querySelector(`.${previewCls}__name`)?.textContent,
        ).toContain('one.png');
        wrapper.unmount();
    });

    test('第一张向前一张回绕到最后一张（81 行 false 路径）', async () => {
        const wrapper = mountGroup();
        await nextTick();
        await openPreview(wrapper, 0);
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        // index(0) 不 > 0 → else：回绕 setCurrent(keys[2-0-1]=keys[1])
        await clickArrow('left');
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        wrapper.unmount();
    });

    test('中间项向前一张直接前进（81 行 true 路径）', async () => {
        const wrapper = mountGroup();
        await nextTick();
        await openPreview(wrapper, 1);
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        // index(1) > 0 → keys[String(0)]
        await clickArrow('left');
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        wrapper.unmount();
    });

    test('循环往返多轮：四条分支反复触发仍保持正确映射', async () => {
        const wrapper = mountGroup();
        await nextTick();
        await openPreview(wrapper, 0);
        await clickArrow('right'); // →2
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        await clickArrow('right'); // 回绕 →1
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        await clickArrow('left'); // 回绕 →2
        expect(canvasSrc()).toBe(`${OK_SRC}?2`);
        await clickArrow('left'); // →1
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        // 关闭后再开：curIndex 保持上次位置
        (
            document.body.querySelector(`.${previewCls}__close`) as HTMLElement
        ).click();
        await nextTick();
        expect(document.body.querySelector(`.${previewCls}`)).toBeNull();
        await openPreview(wrapper, 0);
        expect(canvasSrc()).toBe(`${OK_SRC}?1`);
        wrapper.unmount();
    });

    test('hideOnClickModal=true 组合预览点击遮罩关闭并恢复 body overflow', async () => {
        const wrapper = mount(PreviewGroup, {
            props: { hideOnClickModal: true },
            slots: {
                default: () => [
                    h(FImage, { src: `${OK_SRC}?1`, preview: true }),
                    h(FImage, { src: `${OK_SRC}?2`, preview: true }),
                ],
            },
        });
        await nextTick();
        const previewEl = await openPreview(wrapper, 0);
        expect(document.body.style.overflow).toBe('hidden');
        previewEl.click();
        await nextTick();
        expect(document.body.querySelector(`.${previewCls}`)).toBeNull();
        // 遮罩点击关闭 → closeViewer 恢复关闭前 body overflow（初始为空串）
        expect(document.body.style.overflow).toBe('');
        wrapper.unmount();
        // 卸载不恢复 overflow，显式兜底避免污染后续用例
        document.body.style.overflow = '';
    });

    test('组内全部加载失败（无图守卫）：不注册任何图，点击无法打开预览', async () => {
        imageLoadResult = 'error';
        const warnSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        const wrapper = mount(PreviewGroup, {
            slots: {
                default: () => [
                    h(FImage, { src: `${OK_SRC}?bad1`, preview: true }),
                    h(FImage, { src: `${OK_SRC}?bad2`, preview: true }),
                ],
            },
        });
        await nextTick();
        // 加载失败渲染错误占位，无 __inner 触发区，预览入口不存在
        expect(wrapper.findAll(`.${imgCls}__error`).length).toBe(2);
        expect(wrapper.findAll(`.${imgCls}__inner`).length).toBe(0);
        expect(document.body.querySelector(`.${previewCls}`)).toBeNull();
        warnSpy.mockRestore();
        wrapper.unmount();
    });
});
