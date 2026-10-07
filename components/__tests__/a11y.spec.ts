/**
 * 无障碍（a11y）专项测试
 *
 * 覆盖本轮改造：
 * - FSelect：combobox 语义 + 键盘导航（上下键/Enter/Esc/Home/End）
 * - FModal/FDrawer：role=dialog、aria-modal、aria-labelledby、焦点圈闭、Esc 修复
 * - useEsc：多弹窗只响应一个 Esc
 * - FPopper：role 参数化（默认无 role，tooltip 显式声明）
 * - FSwitch：role=switch + aria-checked + 键盘触发
 * - FTabs：tablist/tab 语义 + 方向键漫游
 * - FFormItem：label id 关联（aria-labelledby）
 */
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import FSelect from '../select';
import FOption from '../select/option';
import FSwitch from '../switch';
import FTabs, { FTabPane } from '../tabs';
import FModal from '../modal';
import FDrawer from '../drawer';
import FPopper from '../popper';
import FTooltip from '../tooltip';
import FForm from '../form';
import FFormItem from '../form/formItem.vue';
import FInput from '../input';
import getPrefixCls from '../_util/getPrefixCls';
import { wait } from '../_util/__tests__/helpers';

const selectPrefix = getPrefixCls('select');

const OPTIONS = [
    { label: '北京', value: 'bj' },
    { label: '上海', value: 'sh' },
    { label: '广州', value: 'gz' },
];

const mountSelect = (props: Record<string, unknown> = {}) =>
    mount(FSelect as any, {
        props: {
            appendToContainer: false,
            ...props,
        } as any,
        slots: {
            default: () =>
                OPTIONS.map((o) => h(FOption as any, { value: o.value, label: o.label })),
        },
        attachTo: document.body,
    } as any);

const keydown = (el: any, key: string) => el.trigger('keydown', { key });

describe('FSelect 无障碍', () => {
    test('触发器带 combobox 语义与 aria 关联', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        expect(trigger.attributes('role')).toBe('combobox');
        expect(trigger.attributes('aria-haspopup')).toBe('listbox');
        expect(trigger.attributes('aria-expanded')).toBe('false');
        const listId = trigger.attributes('aria-controls');
        expect(listId).toBeTruthy();
        // 下拉打开后 aria-expanded 同步
        await trigger.trigger('click');
        await nextTick();
        expect(trigger.attributes('aria-expanded')).toBe('true');
        // listbox 容器与 option 语义
        const listbox = wrapper.find(`#${listId}`);
        expect(listbox.exists()).toBe(true);
        const options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[0].attributes('role')).toBe('option');
        expect(options[0].attributes('aria-selected')).toBe('true');
        wrapper.unmount();
    });

    test('键盘：ArrowDown/ArrowUp 移动高亮，aria-activedescendant 跟随', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        let options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[0].classes('is-hover')).toBe(true);
        // 下移到「上海」
        await keydown(trigger, 'ArrowDown');
        await nextTick();
        options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[1].classes('is-hover')).toBe(true);
        const activeId = trigger.attributes('aria-activedescendant');
        expect(activeId).toContain('sh');
        // 再上移回到「北京」
        await keydown(trigger, 'ArrowUp');
        await nextTick();
        options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[0].classes('is-hover')).toBe(true);
        wrapper.unmount();
    });

    test('键盘：Enter 选中高亮项并收起，Esc 仅收起', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        await keydown(trigger, 'ArrowDown');
        await keydown(trigger, 'Enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('sh');
        // 重新打开后按 Esc 只收起不选
        await trigger.trigger('click');
        await nextTick();
        await keydown(trigger, 'Escape');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue')!;
        expect(updates.length).toBe(1);
        expect((wrapper.vm as any).isOpenedRef).toBe(false);
        wrapper.unmount();
    });

    test('键盘：Home/End 跳到首尾项', async () => {
        const wrapper = mountSelect();
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        await keydown(trigger, 'End');
        await nextTick();
        let options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[2].classes('is-hover')).toBe(true);
        await keydown(trigger, 'Home');
        await nextTick();
        options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[0].classes('is-hover')).toBe(true);
        wrapper.unmount();
    });

    test('IME：组合态 Enter（选词确认）不触发选项选中', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        await keydown(trigger, 'ArrowDown');
        // IME 组合中的 Enter：isComposing=true（真实浏览器选词确认）
        await trigger.trigger('keydown', {
            key: 'Enter',
            isComposing: true,
        });
        await nextTick();
        // 不应选中任何选项，下拉保持打开
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((wrapper.vm as any).isOpenedRef).toBe(true);
        // keyCode 229 变体（部分旧浏览器/输入法只报 229）
        await trigger.trigger('keydown', {
            key: 'Enter',
            keyCode: 229,
        });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        // 组合结束后（isComposing=false）Enter 正常选中
        await trigger.trigger('keydown', {
            key: 'Enter',
            isComposing: false,
        });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('sh');
        wrapper.unmount();
    });
});

describe('FPopper / FTooltip role', () => {
    test('FPopper 默认不输出 role（去掉错误的 tooltip 硬编码）', async () => {
        const wrapper = mount(
            FPopper as any,
            {
                props: { lazy: false, appendToContainer: false, trigger: 'click' },
                slots: {
                    trigger: () => h('span', '触发'),
                    default: () => h('div', { class: 'pop-content' }, '内容'),
                },
            } as any,
        );
        await nextTick();
        const popperWrapper = wrapper.find('.fes-popper-wrapper');
        expect(popperWrapper.exists()).toBe(true);
        expect(popperWrapper.attributes('role')).toBeUndefined();
        wrapper.unmount();
    });

    test('FTooltip 声明 role=tooltip', async () => {
        const wrapper = mount(
            FTooltip as any,
            {
                props: {
                    title: '提示文字',
                    modelValue: true,
                    lazy: false,
                    appendToContainer: false,
                },
                slots: { default: () => h('span', '宿主') },
            } as any,
        );
        await nextTick();
        await wait(50);
        // tooltip 的 popper wrapper 带 role=tooltip
        const popperWrapper = wrapper.find('.fes-popper-wrapper');
        expect(popperWrapper.exists()).toBe(true);
        expect(popperWrapper.attributes('role')).toBe('tooltip');
        wrapper.unmount();
    });
});

describe('FModal 无障碍', () => {
    test('role=dialog + aria-modal + aria-labelledby + 焦点圈闭 + Esc 关闭', async () => {
        const wrapper = mount(FModal as any, {
            props: { show: true, title: '标题', appendToContainer: false },
            slots: { default: () => h('p', '内容') },
            attachTo: document.body,
        } as any);
        await nextTick();
        await wait(50);
        const dialog = document.querySelector('.fes-modal-wrapper');
        expect(dialog).toBeTruthy();
        expect(dialog!.getAttribute('role')).toBe('dialog');
        expect(dialog!.getAttribute('aria-modal')).toBe('true');
        expect(dialog!.getAttribute('aria-labelledby')).toBeTruthy();
        // 打开后初始聚焦落在弹层内
        expect(dialog!.contains(document.activeElement)).toBe(true);
        // Tab 圈闭：焦点保持在弹层内
        const focusables = dialog!.querySelectorAll('button');
        expect(focusables.length).toBeGreaterThan(0);
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        await nextTick();
        expect(dialog!.contains(document.activeElement)).toBe(true);
        // Esc 关闭
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
        await nextTick();
        await wait(50);
        expect(wrapper.emitted('update:show')![0][0]).toBe(false);
        wrapper.unmount();
    });
});

describe('FDrawer 无障碍', () => {
    test('role=dialog + aria-modal + Esc 关闭', async () => {
        const wrapper = mount(FDrawer as any, {
            props: { show: true, title: '抽屉标题', appendToContainer: false },
            slots: { default: () => h('p', '抽屉内容') },
            attachTo: document.body,
        } as any);
        await nextTick();
        await wait(50);
        const dialog = document.querySelector('.fes-drawer-wrapper');
        expect(dialog).toBeTruthy();
        expect(dialog!.getAttribute('role')).toBe('dialog');
        expect(dialog!.getAttribute('aria-modal')).toBe('true');
        expect(dialog!.getAttribute('aria-labelledby')).toBeTruthy();
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
        await nextTick();
        await wait(50);
        expect(wrapper.emitted('update:show')![0][0]).toBe(false);
        wrapper.unmount();
    });
});

describe('useEsc 多弹窗修复', () => {
    test('两个弹窗同开，Esc 只关闭栈顶一个（另一层保持）', async () => {
        const wrapper = mount(
            {
                components: { FModal },
                template: `
                    <div>
                        <FModal :show="true" title="A" :appendToContainer="false" />
                        <FModal :show="true" title="B" :appendToContainer="false" />
                    </div>
                `,
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        await wait(50);
        expect(document.querySelectorAll('.fes-modal-wrapper').length).toBe(2);
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }),
        );
        await nextTick();
        await wait(50);
        // 真断言：逐组件检查 update:show 发射情况——只有后打开的 B 关闭，A 保持
        const modals = wrapper.findAllComponents(FModal as any);
        expect(modals.length).toBe(2);
        const emittedA = modals[0].emitted('update:show') ?? [];
        const emittedB = modals[1].emitted('update:show') ?? [];
        expect(emittedA.length).toBe(0);
        expect(emittedB.length).toBe(1);
        expect(emittedB[0][0]).toBe(false);
        wrapper.unmount();
    });

    test('Esc 关闭栈顶后，再次 Esc 关闭下一层', async () => {
        const wrapper = mount(
            {
                components: { FModal },
                template: `
                    <div>
                        <FModal :show="true" title="A" :appendToContainer="false" />
                        <FModal :show="showB" title="B" :appendToContainer="false" @update:show="showB = $event" />
                    </div>
                `,
                data() {
                    return { showB: true };
                },
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        await wait(50);
        // 第一次 Esc：关 B
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }),
        );
        await nextTick();
        await wait(50);
        const modals = wrapper.findAllComponents(FModal as any);
        expect((modals[1].emitted('update:show') ?? []).length).toBe(1);
        expect((modals[0].emitted('update:show') ?? []).length).toBe(0);
        // showB 置 false 后（B 卸载监听、出栈），第二次 Esc 关 A
        (wrapper.vm as any).showB = false;
        await nextTick();
        await wait(50);
        window.dispatchEvent(
            new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }),
        );
        await nextTick();
        await wait(50);
        expect((wrapper.findAllComponents(FModal as any)[0].emitted('update:show') ?? []).length).toBe(1);
        wrapper.unmount();
    });
});

describe('FSwitch 无障碍', () => {
    test('role=switch + aria-checked 随状态翻转 + 键盘触发', async () => {
        const wrapper = mount(FSwitch as any, {
            props: { modelValue: false },
            attachTo: document.body,
        } as any);
        await nextTick();
        const el = wrapper.find('.fes-switch');
        expect(el.attributes('role')).toBe('switch');
        expect(el.attributes('aria-checked')).toBe('false');
        expect(el.attributes('tabindex')).toBe('0');
        await el.trigger('keydown', { key: ' ' });
        await nextTick();
        expect(el.attributes('aria-checked')).toBe('true');
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe(true);
        wrapper.unmount();
    });
});

describe('FTabs 无障碍', () => {
    test('tablist/tab 语义 + 方向键切换', async () => {
        const wrapper = mount(FTabs as any, {
            props: { modelValue: 'a' },
            slots: {
                default: () => [
                    h(FTabPane as any, { key: 'a', value: 'a', name: 'A' }),
                    h(FTabPane as any, { key: 'b', value: 'b', name: 'B' }),
                ],
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        const tablist = wrapper.find('[role="tablist"]');
        expect(tablist.exists()).toBe(true);
        const tabs = tablist.findAll('[role="tab"]');
        expect(tabs.length).toBe(2);
        expect(tabs[0].attributes('aria-selected')).toBe('true');
        expect(tabs[1].attributes('aria-selected')).toBe('false');
        // roving tabindex：仅激活 tab 可聚焦
        expect(tabs[0].attributes('tabindex')).toBe('0');
        expect(tabs[1].attributes('tabindex')).toBe('-1');
        // 右方向键切到 B
        await tabs[0].trigger('keydown', { key: 'ArrowRight' });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('b');
        wrapper.unmount();
    });
});

describe('FFormItem 无障碍', () => {
    test('label 带 id，控件 aria-labelledby 关联', async () => {
        const wrapper = mount(
            {
                components: { FForm, FFormItem, FInput },
                template: `
                    <FForm :model="{}">
                        <FFormItem label="用户名" prop="user">
                            <FInput />
                        </FFormItem>
                    </FForm>
                `,
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        const label = wrapper.find('.fes-form-item-label');
        expect(label.exists()).toBe(true);
        const labelId = label.attributes('id');
        expect(labelId).toBeTruthy();
        const input = wrapper.find('input');
        expect(input.attributes('aria-labelledby')).toBe(labelId);
        wrapper.unmount();
    });
});
