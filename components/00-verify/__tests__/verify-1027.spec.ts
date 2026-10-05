/**
 * #1027 回归：layout 的 embedded 四件套全支持。
 * - layout.vue provide(...toRefs(props)) 含 embedded；const.ts 声明了 layout 级 prop
 * - main.vue / footer.vue：props 声明 + inject + is-embedded 类（原有）
 * - aside.vue / header.vue：修复后补齐 props 声明 + inject + is-embedded 类
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FLayout, FHeader, FMain, FAside, FFooter } from '../../layout/index';

const mountLayout = (slots: any, layoutProps: Record<string, unknown> = {}) =>
    mount(FLayout, {
        props: layoutProps as any,
        slots,
        attachTo: document.body,
    });

const CHILDREN = (extra: Record<string, unknown> = {}) => () => [
    h(FHeader, { class: 'v-header', ...extra }),
    h(FAside, { class: 'v-aside', ...extra }),
    h(FMain, { class: 'v-main', ...extra }),
    h(FFooter, { class: 'v-footer', ...extra }),
];

describe('#1027 FLayout embedded 支持面验证', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('layout 级 embedded:true → 四件套（header/aside/main/footer）均注入 is-embedded', async () => {
        const wrapper = mountLayout({ default: CHILDREN() }, { embedded: true });
        await nextTick();
        const header = wrapper.find('.v-header');
        const aside = wrapper.find('.v-aside');
        const main = wrapper.find('.v-main');
        const footer = wrapper.find('.v-footer');
        [header, aside, main, footer].forEach((el) => expect(el.exists()).toBe(true));
        // 修复后：四者均含 is-embedded（修复前 header/aside 缺失）
        expect(main.classes()).toContain('is-embedded');
        expect(footer.classes()).toContain('is-embedded');
        expect(header.classes()).toContain('is-embedded');
        expect(aside.classes()).toContain('is-embedded');
        wrapper.unmount();
    });

    test('组件级 embedded prop：四件套均声明该 prop 且单独生效（不再 attr 透传）', async () => {
        const wrapper = mountLayout({
            default: CHILDREN({ embedded: true }),
        });
        await nextTick();
        // 修复后：header/aside 也声明了 embedded prop，单独开启即生效
        expect(wrapper.find('.v-main').classes()).toContain('is-embedded');
        expect(wrapper.find('.v-footer').classes()).toContain('is-embedded');
        const header = wrapper.find('.v-header');
        const aside = wrapper.find('.v-aside');
        expect(header.classes()).toContain('is-embedded');
        expect(aside.classes()).toContain('is-embedded');
        // 已声明 prop → 不再以普通 HTML 属性透传到根元素
        expect(header.attributes('embedded')).toBeUndefined();
        expect(aside.attributes('embedded')).toBeUndefined();
        wrapper.unmount();
    });

    test('默认（无 embedded）：四者均无 is-embedded', async () => {
        const wrapper = mountLayout({ default: CHILDREN() });
        await nextTick();
        ['v-header', 'v-aside', 'v-main', 'v-footer'].forEach((cls) => {
            expect(wrapper.find(`.${cls}`).classes()).not.toContain('is-embedded');
        });
        wrapper.unmount();
    });
});
