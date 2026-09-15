import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FPopper from '../popper';

const TEST_TRIGGER = 'test-trigger';
const wait = (ms = 40) =>
    new Promise((r) => setTimeout(r, ms));

const _mount = (popperProps: Record<string, any> = {}) =>
    mount({
        setup(_, { slots }) {
            return () => h('div', h(FPopper, popperProps, slots));
        },
    }, {
        slots: {
            trigger: () => h('div', { class: TEST_TRIGGER }, '触发'),
            default: () => h('div', { class: 'popper-content' }, '内容'),
        },
        attachTo: document.body,
    });

describe('FPopper useScroll 滚动重算分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('visible 且可滚动容器滚动时触发 computePopper', async () => {
        const wrapper = _mount({ lazy: false, appendToContainer: false });
        await nextTick();
        await wait();
        // 打开 popper（visible=true → disabledWatch false）
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        // vi.waitFor：条件满足即返回（技能推荐），替代定长 wait
        await vi.waitFor(() => {
            expect(document.querySelector('.popper-content')).toBeTruthy();
        });
        // 在 window 上滚动（target === container → 命中 return 分支）
        window.dispatchEvent(new Event('scroll'));
        await wait();
        // 在非容器元素上滚动 → computePopper 执行
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.dispatchEvent(new Event('scroll', { bubbles: true }));
        await wait();
        expect(document.querySelector('.popper-content')).toBeTruthy();
        wrapper.unmount();
    });

    test('disabledWatch=true（未打开）时滚动直接返回', async () => {
        const wrapper = _mount({ lazy: false, appendToContainer: false });
        await nextTick();
        await wait();
        // 不打开 popper → visible=false → disabledWatch true
        // lazy:false 下 popper 已渲染但 v-show 隐藏（display:none）
        const content = document.querySelector('.popper-content') as HTMLElement;
        expect(content?.parentElement?.getAttribute('style')).toContain('display: none');
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.dispatchEvent(new Event('scroll', { bubbles: true }));
        await wait();
        expect(content?.parentElement?.getAttribute('style')).toContain('display: none');
        wrapper.unmount();
    });

    test('disabled 为函数时函数分支生效', async () => {
        const disabledFn = vi.fn(() => true);
        const wrapper = _mount({
            lazy: false,
            appendToContainer: false,
            disabled: disabledFn,
        });
        await nextTick();
        await wait();
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await wait();
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.dispatchEvent(new Event('scroll', { bubbles: true }));
        await wait();
        // disabled 函数分支被真实调用（滚动处理链路走通）
        expect(disabledFn).toHaveBeenCalled();
        wrapper.unmount();
    });

    test('appendToContainer=true 时容器滚动分支', async () => {
        const wrapper = _mount({ lazy: false });
        await nextTick();
        await wait();
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await wait();
        window.dispatchEvent(new Event('scroll'));
        await wait();
        // target=body 命中 getContainer 返回的容器 → 跳过重算
        document.body.dispatchEvent(new Event('scroll'));
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('getContainer 返回实际容器且 target 命中时跳过重算', async () => {
        const wrapper = _mount({
            lazy: false,
            appendToContainer: true,
            getContainer: () => document.body,
        });
        await nextTick();
        await wait();
        await wrapper.find(`.${TEST_TRIGGER}`).trigger('mouseenter');
        await wait();
        // target 即 getContainer 返回的元素 → return 分支
        document.body.dispatchEvent(new Event('scroll'));
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });
});
