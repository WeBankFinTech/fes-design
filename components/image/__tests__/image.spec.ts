import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import getPrefixCls from '../../_util/getPrefixCls';
import FImage from '../image.vue';
import PreviewGroup from '../preview-group';

const imgPrefixCls = getPrefixCls('img');
const previewPrefixCls = getPrefixCls('preview');

const OK_SRC
    = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAUwAOw==';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// jsdom 不会真正加载图片，这里拦截 src 赋值，按预设结果同步派发 load / error 事件
let imageLoadResult: 'success' | 'error' | 'pending' = 'success';
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
        } else if (imageLoadResult === 'error') {
            this.dispatchEvent(new Event('error'));
        }
    },
});

describe('FImage', () => {
    afterEach(() => {
        // Preview 默认 teleport 到 document.body，每个用例后清理避免污染
        document.body.innerHTML = '';
        imageLoadResult = 'success';
    });

    test('src 加载成功后渲染 img 并触发 load', () => {
        const wrapper = mount(FImage, {
            props: { src: OK_SRC },
        });
        expect(wrapper.emitted('load')).toHaveLength(1);
        expect(wrapper.emitted('error')).toBeUndefined();
        const img = wrapper.find(`.${imgPrefixCls}__inner-image`);
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe(OK_SRC);
        expect(wrapper.find(`.${imgPrefixCls}__placeholder`).exists()).toBe(
            false,
        );
        expect(wrapper.find(`.${imgPrefixCls}__error`).exists()).toBe(false);
        // 默认 fit 为 fill，且无 preview / download 时不显示 pointer
        expect(img.attributes('style')).toBe('object-fit: fill;');
    });

    test('fit 类名与 width / height 样式', async () => {
        const wrapper = mount(FImage, {
            props: { src: OK_SRC, fit: 'contain', width: 120, height: 80 },
        });
        expect(wrapper.attributes('style')).toContain('width: 120px;');
        expect(wrapper.attributes('style')).toContain('height: 80px;');
        expect(wrapper.find('img').attributes('style')).toContain(
            'object-fit: contain',
        );

        await wrapper.setProps({ fit: 'cover' });
        expect(wrapper.find('img').attributes('style')).toContain(
            'object-fit: cover',
        );
    });

    test('加载失败触发 error 分支', async () => {
        imageLoadResult = 'error';
        const wrapper = mount(FImage, {
            props: { src: OK_SRC },
        });
        expect(wrapper.emitted('error')).toHaveLength(1);
        expect(wrapper.emitted('load')).toBeUndefined();
        expect(wrapper.find(`.${imgPrefixCls}__error`).exists()).toBe(true);
        expect(wrapper.text()).toContain('加载失败');
        expect(wrapper.find('img').exists()).toBe(false);

        // src 变化后重置错误状态并重新加载
        imageLoadResult = 'success';
        await wrapper.setProps({ src: `${OK_SRC}?reset` });
        expect(wrapper.find(`.${imgPrefixCls}__inner-image`).exists()).toBe(
            true,
        );
        expect(wrapper.find(`.${imgPrefixCls}__error`).exists()).toBe(false);
    });

    test('加载中展示 placeholder，加载完成后切换为 img', async () => {
        imageLoadResult = 'pending';
        const wrapper = mount(FImage, {
            props: { src: OK_SRC },
        });
        expect(wrapper.find(`.${imgPrefixCls}__placeholder`).exists()).toBe(
            true,
        );
        expect(wrapper.text()).toContain('加载中');
        expect(wrapper.find('img').exists()).toBe(false);

        imageLoadResult = 'success';
        await wrapper.setProps({ src: `${OK_SRC}?done` });
        expect(wrapper.find('img').exists()).toBe(true);
        expect(wrapper.find(`.${imgPrefixCls}__placeholder`).exists()).toBe(
            false,
        );
        expect(wrapper.emitted('load')).toHaveLength(1);
    });

    test('preview 开启预览交互，hideOnClickModal 点击遮罩关闭', async () => {
        const wrapper = mount(FImage, {
            props: {
                src: OK_SRC,
                preview: true,
                hideOnClickModal: true,
                name: 'pic.png',
            },
        });
        await nextTick();
        // 可预览的图片 cursor 为 pointer
        expect(wrapper.find('img').attributes('style')).toContain(
            'cursor: pointer',
        );
        // 初始不渲染预览
        expect(document.body.querySelector(`.${previewPrefixCls}`)).toBeNull();

        await wrapper.find(`.${imgPrefixCls}__inner`).trigger('click');
        await nextTick();
        // 预览时锁定 body 滚动
        expect(document.body.style.overflow).toBe('hidden');
        const previewEl = document.body.querySelector(
            `.${previewPrefixCls}`,
        ) as HTMLElement;
        expect(previewEl).not.toBeNull();
        expect(previewEl.style.display).not.toBe('none');
        expect(
            document.body.querySelector(`.${previewPrefixCls}__name`)
                ?.textContent,
        ).toContain('pic.png');
        expect(
            document
                .body.querySelector(`.${previewPrefixCls}__canvas`)
                ?.getAttribute('src'),
        ).toBe(OK_SRC);

        // 点击遮罩关闭预览，恢复 body 滚动
        previewEl.click();
        await nextTick();
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(document.body.style.overflow).toBe('');
        expect(document.body.querySelector(`.${previewPrefixCls}`)).toBeNull();
    });

    test('preview 默认点击遮罩不关闭，点击关闭按钮关闭', async () => {
        const wrapper = mount(FImage, {
            props: { src: OK_SRC, preview: true },
        });
        await nextTick();
        await wrapper.find(`.${imgPrefixCls}__inner`).trigger('click');
        await nextTick();
        const previewEl = document.body.querySelector(
            `.${previewPrefixCls}`,
        ) as HTMLElement;
        expect(previewEl).not.toBeNull();

        // hideOnClickModal 默认 false，点击遮罩不关闭
        previewEl.click();
        await nextTick();
        expect(wrapper.emitted('close')).toBeUndefined();

        const closeBtn = document.body.querySelector(
            `.${previewPrefixCls}__close`,
        ) as HTMLElement;
        closeBtn.click();
        await nextTick();
        expect(wrapper.emitted('close')).toHaveLength(1);
        expect(document.body.querySelector(`.${previewPrefixCls}`)).toBeNull();
    });

    test('previewContainer 指定预览挂载容器', async () => {
        const host = document.createElement('div');
        document.body.appendChild(host);
        const wrapper = mount(FImage, {
            props: {
                src: OK_SRC,
                preview: true,
                hideOnClickModal: true,
                previewContainer: () => host,
            },
            attachTo: host,
        });
        await nextTick();
        await wrapper.find(`.${imgPrefixCls}__inner`).trigger('click');
        await nextTick();
        // 指定容器后 teleport 关闭，预览直接渲染在容器内
        const previewEl = host.querySelector(
            `.${previewPrefixCls}`,
        ) as HTMLElement;
        expect(previewEl).not.toBeNull();

        previewEl.click();
        await nextTick();
        expect(wrapper.emitted('close')).toHaveLength(1);

        wrapper.unmount();
        host.remove();
    });

    test('download 点击触发下载', async () => {
        const wrapper = mount(FImage, {
            props: { src: OK_SRC, download: true },
        });
        await nextTick();
        // 可下载的图片 cursor 为 pointer
        expect(wrapper.find('img').attributes('style')).toContain(
            'cursor: pointer',
        );

        await wrapper.find(`.${imgPrefixCls}__inner`).trigger('click');
        const anchor = document.body.querySelector('a');
        expect(anchor).not.toBeNull();
        expect(anchor?.getAttribute('href')).toBe(OK_SRC);
        expect(anchor?.getAttribute('target')).toBe('_blank');
        // 下载后临时 a 标签会被移除
        await sleep(10);
        expect(document.body.querySelector('a')).toBeNull();
    });

    test('lazy 懒加载在可见后完成加载', async () => {
        imageLoadResult = 'pending';
        const wrapper = mount(FImage, {
            props: { src: OK_SRC, lazy: true },
            attachTo: document.body,
        });
        // 初始未进入加载完成状态，展示 placeholder
        expect(wrapper.find(`.${imgPrefixCls}__placeholder`).exists()).toBe(
            true,
        );
        expect(wrapper.find('img').exists()).toBe(false);

        // 懒加载滚动回调被 throttle(200ms) 包裹，等待节流窗口过去再触发滚动
        imageLoadResult = 'success';
        await sleep(300);
        window.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.find(`.${imgPrefixCls}__inner-image`).exists()).toBe(
            true,
        );
        expect(wrapper.emitted('load')).toHaveLength(1);
        wrapper.unmount();
    });

    test('默认插槽自定义内容也可触发预览', async () => {
        const wrapper = mount(FImage, {
            props: { src: OK_SRC, preview: true },
            slots: {
                default: () =>
                    h('button', { class: 'img-custom-trigger' }, '打开图片'),
            },
        });
        await nextTick();
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.find('.img-custom-trigger').exists()).toBe(true);

        await wrapper.find('.img-custom-trigger').trigger('click');
        await nextTick();
        expect(
            document.body.querySelector(`.${previewPrefixCls}`),
        ).not.toBeNull();
    });

    test('preview-group 组合预览支持切换', async () => {
        const wrapper = mount(PreviewGroup, {
            slots: {
                default: () => [
                    h(FImage, { src: `${OK_SRC}?1`, preview: true }),
                    h(FImage, {
                        src: `${OK_SRC}?2`,
                        preview: true,
                        name: 'two.png',
                    }),
                ],
            },
        });
        await nextTick();
        const inners = wrapper.findAll(`.${imgPrefixCls}__inner`);
        expect(inners).toHaveLength(2);

        await inners[0].trigger('click');
        await nextTick();
        const previewEl = document.body.querySelector(
            `.${previewPrefixCls}`,
        ) as HTMLElement;
        expect(previewEl).not.toBeNull();
        // 组合模式出现切换箭头
        expect(
            document.body.querySelector(`.${previewPrefixCls}__arrow-left`),
        ).not.toBeNull();
        expect(
            document.body.querySelector(`.${previewPrefixCls}__arrow-right`),
        ).not.toBeNull();

        // 切换到下一张
        (
            document.body.querySelector(
                `.${previewPrefixCls}__arrow-right`,
            ) as HTMLElement
        ).click();
        await nextTick();
        expect(
            document
                .body.querySelector(`.${previewPrefixCls}__canvas`)
                ?.getAttribute('src'),
        ).toBe(`${OK_SRC}?2`);
        expect(
            document.body.querySelector(`.${previewPrefixCls}__name`)
                ?.textContent,
        ).toContain('two.png');

        // 关闭组合预览
        (
            document.body.querySelector(
                `.${previewPrefixCls}__close`,
            ) as HTMLElement
        ).click();
        await nextTick();
        expect(document.body.querySelector(`.${previewPrefixCls}`)).toBeNull();
    });
});
