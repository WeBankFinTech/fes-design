import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FAside, FFooter, FHeader, FLayout, FMain } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('layout');

// Teleport/跨用例 DOM 泄漏防护（技能 jsdom 陷阱 #7）
afterEach(() => {
    document.body.innerHTML = '';
});

// Left/Right 图标 svg path d 的区分前缀
const LEFT_ICON_D = 'M709.419';
const RIGHT_ICON_D = 'm314.581';

const mountWithSlot = (slot: () => unknown[]) =>
    mount(FLayout, {
        attachTo: document.body,
        slots: { default: slot },
    });

describe('FLayout aside 分支补全', () => {
    test('aside 非 layout 直接子级：告警但仍渲染', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(FAside, {
            attachTo: document.body,
            slots: { default: () => '独立侧栏' },
        });
        await nextTick();
        expect(warnSpy).toHaveBeenCalled();
        expect(wrapper.find(`.${prefixCls}-aside`).text()).toBe('独立侧栏');
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('collapsible 默认展开：点击 trigger 折叠，emits update:collapsed，再点恢复', async () => {
        const wrapper = mountWithSlot(() => [
            h(FAside, { collapsible: true }, () => '侧栏'),
            h(FMain, () => '主体'),
        ]);
        await nextTick();
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.attributes('style')).toContain('width: 200px');

        const asideComp = wrapper.findComponent(FAside);
        const trigger = asideComp.find(`.${prefixCls}-aside-trigger`);
        expect(trigger.exists()).toBe(true);
        // 展开态渲染 LeftOutlined（!currentCollapsed 分支）
        expect(trigger.find('svg path').attributes('d').startsWith(LEFT_ICON_D)).toBe(true);

        await trigger.trigger('click');
        await nextTick();
        const emitted = asideComp.emitted('update:collapsed');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toBe(true);
        expect(aside.classes()).toContain('is-collapsed');
        expect(aside.attributes('style')).toContain('width: 48px');

        // 再次点击恢复展开，图标回到 LeftOutlined
        await trigger.trigger('click');
        await nextTick();
        expect(asideComp.emitted('update:collapsed')![1][0]).toBe(false);
        expect(aside.attributes('style')).toContain('width: 200px');
        expect(trigger.find('svg path').attributes('d').startsWith(LEFT_ICON_D)).toBe(true);
        wrapper.unmount();
    });

    test('collapsed prop 受控：is-collapsed / collapsedWidth / bordered 类名', async () => {
        const wrapper = mountWithSlot(() => [
            h(
                FAside,
                {
                    collapsible: true,
                    collapsed: true,
                    collapsedWidth: '80px',
                    bordered: true,
                },
                () => '侧栏',
            ),
            h(FMain, () => '主体'),
        ]);
        await nextTick();
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.classes()).toContain('is-collapsed');
        expect(aside.classes()).toContain('is-has-trigger');
        expect(aside.classes()).toContain('is-bordered');
        expect(aside.attributes('style')).toContain('width: 80px');
        wrapper.unmount();
    });

    test('right placement（aside 在最后）：图标随折叠在 Right/Left 间切换', async () => {
        const wrapper = mountWithSlot(() => [
            h(FLayout, { default: () => [h(FMain, () => '内主体')] }),
            h(FAside, { collapsible: true }, () => '侧栏'),
        ]);
        await nextTick();
        const asides = wrapper.findAll(`.${prefixCls}-aside`);
        expect(asides.length).toBe(1);
        expect(asides[0].classes()).toContain('is-placement-right');

        const asideComp = wrapper.findComponent(FAside);
        const trigger = asideComp.find(`.${prefixCls}-aside-trigger`);
        // 未折叠 → else 分支渲染 RightOutlined
        expect(trigger.find('svg path').attributes('d').startsWith(RIGHT_ICON_D)).toBe(true);
        await trigger.trigger('click');
        await nextTick();
        // 折叠 → LeftOutlined（currentCollapsed 分支）
        expect(asideComp.emitted('update:collapsed')![0][0]).toBe(true);
        expect(trigger.find('svg path').attributes('d').startsWith(LEFT_ICON_D)).toBe(true);
        wrapper.unmount();
    });

    test('showTrigger=false：不渲染 trigger 且无 is-has-trigger', async () => {
        const wrapper = mountWithSlot(() => [
            h(FAside, { collapsible: true, showTrigger: false }, () => '侧栏'),
            h(FMain, () => '主体'),
        ]);
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-aside-trigger`).exists()).toBe(false);
        expect(
            wrapper.find(`.${prefixCls}-aside`).classes().includes('is-has-trigger'),
        ).toBe(false);
        wrapper.unmount();
    });
});

describe('FLayout containerClass / 子级形态分支', () => {
    test('containerClass 对象：合并到容器类名', async () => {
        const wrapper = mount(FLayout, {
            props: { containerClass: { 'custom-obj': true } },
            slots: { default: () => [h(FMain, () => '主体')] },
        });
        await nextTick();
        const container = wrapper.find(`.${prefixCls}-container`);
        expect(container.classes()).toContain(`${prefixCls}-container`);
        expect(container.classes()).toContain('custom-obj');
        wrapper.unmount();
    });

    test('containerClass 数组：依次追加', async () => {
        const wrapper = mount(FLayout, {
            props: { containerClass: ['arr-a', 'arr-b'] },
            slots: { default: () => [h(FMain, () => '主体')] },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-container`).classes()).toEqual([
            `${prefixCls}-container`,
            'arr-a',
            'arr-b',
        ]);
        wrapper.unmount();
    });

    test('containerClass 字符串：追加单个类名', async () => {
        const wrapper = mount(FLayout, {
            props: { containerClass: 'str-cls' },
            slots: { default: () => [h(FMain, () => '主体')] },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-container`).classes()).toContain('str-cls');
        wrapper.unmount();
    });

    test('无 aside/嵌套 layout 子级：children 为空，保持非水平', async () => {
        const wrapper = mountWithSlot(() => [
            h(FHeader, () => '头部'),
            h(FMain, () => '主体'),
            h(FFooter, () => '底部'),
        ]);
        await nextTick();
        expect(wrapper.classes()).toContain('is-root');
        expect(wrapper.classes()).not.toContain('is-horizontal');
        wrapper.unmount();
    });

    test('有嵌套 layout 但无 aside：布局保持非水平', async () => {
        const wrapper = mountWithSlot(() => [
            h(FLayout, { default: () => [h(FMain, () => '内主体')] }),
            h(FMain, () => '主体'),
        ]);
        await nextTick();
        // children=[LAYOUT]，无 aside → 不产生水平布局
        const nested = wrapper.find(`.${prefixCls}-container > .${prefixCls}`);
        expect(nested.exists()).toBe(true);
        expect(wrapper.classes()).not.toContain('is-horizontal');
        wrapper.unmount();
    });

    test('aside 位于中间（前后均为嵌套 layout）：placement 落空，无方位类', async () => {
        const wrapper = mountWithSlot(() => [
            h(FLayout, { default: () => [h(FMain, () => '前')] }),
            h(FAside, { collapsible: true }, () => '侧栏'),
            h(FLayout, { default: () => [h(FMain, () => '后')] }),
        ]);
        await nextTick();
        await nextTick();
        // 子级 setup 顺序：children=[LAYOUT, ASIDE, LAYOUT]；后续嵌套 layout 的 addChild
        // 触发重渲染后 asidePlacement 重新计算：children[0] 与 children[last] 均非 ASIDE
        const asides = wrapper.findAll(`.${prefixCls}-aside`);
        expect(asides.length).toBe(1);
        const classes = asides[0].classes().join(' ');
        expect(classes).not.toContain('is-placement-left');
        expect(classes).not.toContain('is-placement-right');
        wrapper.unmount();
    });
});

// 不可达分支说明（layout.vue asidePlacement）：
// L56 `children.length > 0` 的 else：asidePlacement 只有被 aside 子组件消费时才求值，
// 而 aside 消费时必然已把自己 addChild 进 children（length ≥ 1）→ 空数组分支不可达。
// L60 的 else（children[last] 非 ASIDE）由上方「中间 aside」用例覆盖。
