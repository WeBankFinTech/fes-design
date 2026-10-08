/**
 * 无障碍（a11y）专项测试
 *
 * 覆盖本轮改造：
 * - FSelect：combobox 语义 + 键盘导航（上下键/Enter/Esc/Home/End）
 * - FModal/FDrawer：role=dialog、aria-modal、aria-labelledby、焦点圈闭、Esc 修复
 * - useEsc：多弹窗只响应一个 Esc、栈顶不可关闭时不下沉
 * - FPopper：role 参数化（默认无 role，tooltip 显式声明）、浮层焦点作用域
 * - FSwitch：role=switch + aria-checked + 键盘触发
 * - FTabs：tablist/tab 语义 + 方向键漫游 + 只配 name 的 tab
 * - FFormItem：label id 关联（aria-labelledby），无 label 时不产生断链引用
 */
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import FSelect, { FSelectGroupOption } from '../select';
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

/**
 * jsdom 下 offsetWidth/offsetHeight 恒为 0，
 * getFocusableChildren 会返回空数组，焦点圈闭退化到「无可聚焦元素」兜底分支。
 * 这里临时给出尺寸，让 Tab 圈闭走真实分支。
 */
const withElementSize = (fn: () => Promise<void>) => async () => {
    const widthDesc = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetWidth',
    );
    const heightDesc = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetHeight',
    );
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: () => 100,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get: () => 20,
    });
    try {
        await fn();
    } finally {
        if (widthDesc) {
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDesc);
        } else {
            delete (HTMLElement.prototype as any).offsetWidth;
        }
        if (heightDesc) {
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', heightDesc);
        } else {
            delete (HTMLElement.prototype as any).offsetHeight;
        }
    }
};

const pressTab = async (shiftKey = false) => {
    const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey,
        bubbles: true,
        cancelable: true,
    });
    window.dispatchEvent(event);
    await nextTick();
    return event;
};

const pressEsc = async () => {
    window.dispatchEvent(
        new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }),
    );
    await nextTick();
    await wait(50);
};

// 弹层会 Teleport 到 body，用例失败时 wrapper.unmount() 可能不执行，
// 残留 DOM 会污染后续用例的查询，这里统一清理
afterEach(() => {
    document.body.innerHTML = '';
});

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
        expect(listbox.attributes('role')).toBe('listbox');
        const options = wrapper.findAll(`.${selectPrefix}-option`);
        expect(options[0].attributes('role')).toBe('option');
        expect(options[0].attributes('aria-selected')).toBe('true');
        wrapper.unmount();
    });

    test('filterable：combobox 语义落在真正持有焦点的内部 input 上', async () => {
        const wrapper = mountSelect({ modelValue: 'bj', filterable: true });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        // 外层容器不再声明 combobox，避免出现两个 combobox
        expect(trigger.attributes('role')).toBeUndefined();
        const input = trigger.find('input');
        expect(input.exists()).toBe(true);
        expect(input.attributes('role')).toBe('combobox');
        expect(input.attributes('aria-haspopup')).toBe('listbox');
        expect(input.attributes('aria-expanded')).toBe('false');
        const listId = input.attributes('aria-controls');
        expect(listId).toBeTruthy();
        await trigger.trigger('click');
        await nextTick();
        // 展开后焦点确实在 input 上（aria-activedescendant 才有意义）
        expect(document.activeElement).toBe(input.element);
        expect(input.attributes('aria-expanded')).toBe('true');
        expect(document.getElementById(listId!)).toBeTruthy();
        // 高亮项变化时 aria-activedescendant 跟随
        await keydown(trigger, 'ArrowDown');
        await nextTick();
        expect(input.attributes('aria-activedescendant')).toBeTruthy();
        wrapper.unmount();
    });

    test('分组标题在 listbox 内不产生非法子节点', async () => {
        const wrapper = mount(FSelect as any, {
            props: { appendToContainer: false } as any,
            slots: {
                default: () => [
                    h(FSelectGroupOption as any, { key: 'g', label: '华北' }, () => [
                        h(FOption as any, { key: 'bj', value: 'bj', label: '北京' }),
                    ]),
                ],
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        const groupTitle = wrapper.find(`.${selectPrefix}-group-option`);
        expect(groupTitle.exists()).toBe(true);
        // listbox 的直接子节点只能是 option / group，纯展示标题需被读屏忽略
        expect(groupTitle.attributes('role')).toBe('presentation');
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
        // aria-activedescendant 必须指向真实存在的元素
        expect(document.getElementById(activeId!)).toBeTruthy();
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

    test('filterable：已输入过滤文本时 Home/End 交还输入框（不劫持）', async () => {
        const wrapper = mountSelect({ filterable: true });
        await nextTick();
        const trigger = wrapper.find(`.${selectPrefix}-trigger`);
        await trigger.trigger('click');
        await nextTick();
        const input = trigger.find('input');
        // 输入过滤文本：此时 Home/End 属于输入框光标操作
        await input.setValue('北');
        await nextTick();
        const filtered = new KeyboardEvent('keydown', {
            key: 'End',
            bubbles: true,
            cancelable: true,
        });
        trigger.element.dispatchEvent(filtered);
        expect(filtered.defaultPrevented).toBe(false);
        // 未输入过滤文本时仍然接管 Home/End（下拉内跳转）
        await input.setValue('');
        await nextTick();
        const plain = new KeyboardEvent('keydown', {
            key: 'End',
            bubbles: true,
            cancelable: true,
        });
        trigger.element.dispatchEvent(plain);
        expect(plain.defaultPrevented).toBe(true);
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
        // 浮层焦点作用域标记：弹层 Tab 圈闭据此放行
        expect(popperWrapper.attributes('data-fes-focus-scope')).toBe('true');
        wrapper.unmount();
    });

    test('FPopper 支持 tooltip 之外的角色（role 类型放宽）', async () => {
        const wrapper = mount(
            FPopper as any,
            {
                props: {
                    lazy: false,
                    appendToContainer: false,
                    trigger: 'click',
                    role: 'listbox',
                },
                slots: {
                    trigger: () => h('span', '触发'),
                    default: () => h('div', '内容'),
                },
            } as any,
        );
        await nextTick();
        expect(wrapper.find('.fes-popper-wrapper').attributes('role')).toBe(
            'listbox',
        );
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
    test('role=dialog + aria-modal + aria-labelledby 只指向标题 + Esc 关闭', async () => {
        const wrapper = mount(FModal as any, {
            props: { show: true, title: '标题' },
            slots: { default: () => h('p', '内容') },
            attachTo: document.body,
        } as any);
        await nextTick();
        await wait(50);
        const dialog = document.querySelector('.fes-modal-wrapper');
        expect(dialog).toBeTruthy();
        expect(dialog!.getAttribute('role')).toBe('dialog');
        expect(dialog!.getAttribute('aria-modal')).toBe('true');
        const labelId = dialog!.getAttribute('aria-labelledby');
        expect(labelId).toBeTruthy();
        // 引用目标必须存在，且只包含标题文本
        // （指向 header 会把关闭按钮的 aria-label 一起算进可访问名）
        const labelEl = document.getElementById(labelId!);
        expect(labelEl).toBeTruthy();
        expect(labelEl!.textContent?.trim()).toBe('标题');
        expect(labelEl!.querySelector('button')).toBeNull();
        // 打开后初始聚焦落在弹层内
        expect(dialog!.contains(document.activeElement)).toBe(true);
        // Esc 关闭
        await pressEsc();
        expect(wrapper.emitted('update:show')![0][0]).toBe(false);
        wrapper.unmount();
    });

    test('escClosable=false 时 Esc 不关闭', async () => {
        const wrapper = mount(FModal as any, {
            props: { show: true, title: '标题', escClosable: false },
            slots: { default: () => h('p', '内容') },
            attachTo: document.body,
        } as any);
        await nextTick();
        await wait(50);
        await pressEsc();
        expect(wrapper.emitted('update:show')).toBeUndefined();
        wrapper.unmount();
    });

    test(
        'Tab 在弹层内圈闭：末尾 Tab 回到首个，首个 Shift+Tab 回到末尾',
        withElementSize(async () => {
            const wrapper = mount(FModal as any, {
                props: { show: true, title: '标题' },
                slots: { default: () => h('p', '内容') },
                attachTo: document.body,
            } as any);
            await nextTick();
            await wait(50);
            const dialog = document.querySelector('.fes-modal-wrapper')!;
            const focusables = Array.from(
                dialog.querySelectorAll<HTMLElement>('button'),
            ).filter((el) => !el.hasAttribute('disabled'));
            expect(focusables.length).toBeGreaterThan(1);
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            // 打开时聚焦到首个可聚焦元素
            expect(document.activeElement).toBe(first);
            // 末尾 Tab → 回到首个（否则焦点逃逸到 body）
            last.focus();
            await pressTab();
            expect(document.activeElement).toBe(first);
            // 首个 Shift+Tab → 回到末尾
            await pressTab(true);
            expect(document.activeElement).toBe(last);
            wrapper.unmount();
        }),
    );

    test(
        'Teleport 浮层内的焦点不被弹层 Tab 圈闭抢回',
        withElementSize(async () => {
            const wrapper = mount(
                {
                    components: { FModal, FPopper },
                    template: `
                        <FModal :show="true" title="标题">
                            <FPopper
                                :modelValue="true"
                                :lazy="false"
                                trigger="click"
                                placement="bottom-start"
                            >
                                <template #trigger>
                                    <button id="popper-trigger" type="button">打开浮层</button>
                                </template>
                                <button id="in-popper" type="button">浮层按钮</button>
                            </FPopper>
                        </FModal>
                    `,
                },
                { attachTo: document.body } as any,
            );
            await nextTick();
            await wait(80);
            const inPopper = document.getElementById('in-popper');
            expect(inPopper).toBeTruthy();
            const scope = inPopper!.closest('[data-fes-focus-scope]');
            expect(scope).toBeTruthy();
            const dialog = document.querySelector('.fes-modal-wrapper')!;
            // 浮层挂在 body 上，不在 dialog 子树内
            expect(dialog.contains(inPopper!)).toBe(false);
            inPopper!.focus();
            expect(document.activeElement).toBe(inPopper);
            const event = await pressTab();
            // 不抢焦：焦点留在浮层内
            expect(event.defaultPrevented).toBe(false);
            expect(document.activeElement).toBe(inPopper);
            wrapper.unmount();
        }),
    );
});

describe('FDrawer 无障碍', () => {
    test('role=dialog + aria-labelledby 只指向标题 + Esc 关闭', async () => {
        const wrapper = mount(FDrawer as any, {
            props: { show: true, title: '抽屉标题' },
            slots: { default: () => h('p', '抽屉内容') },
            attachTo: document.body,
        } as any);
        await nextTick();
        await wait(50);
        const dialog = document.querySelector('.fes-drawer-wrapper');
        expect(dialog).toBeTruthy();
        expect(dialog!.getAttribute('role')).toBe('dialog');
        expect(dialog!.getAttribute('aria-modal')).toBe('true');
        const labelId = dialog!.getAttribute('aria-labelledby');
        expect(labelId).toBeTruthy();
        const labelEl = document.getElementById(labelId!);
        expect(labelEl).toBeTruthy();
        expect(labelEl!.textContent?.trim()).toBe('抽屉标题');
        expect(labelEl!.querySelector('button')).toBeNull();
        await pressEsc();
        expect(wrapper.emitted('update:show')![0][0]).toBe(false);
        wrapper.unmount();
    });

    test(
        'Tab 在抽屉内圈闭（焦点不逃逸）',
        withElementSize(async () => {
            const wrapper = mount(FDrawer as any, {
                props: { show: true, title: '抽屉标题' },
                slots: { default: () => h('p', '抽屉内容') },
                attachTo: document.body,
            } as any);
            await nextTick();
            await wait(50);
            const dialog = document.querySelector('.fes-drawer-wrapper')!;
            expect(dialog.contains(document.activeElement)).toBe(true);
            const focusables = Array.from(
                dialog.querySelectorAll<HTMLElement>('button'),
            ).filter((el) => !el.hasAttribute('disabled'));
            expect(focusables.length).toBeGreaterThan(0);
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            last.focus();
            await pressTab();
            expect(document.activeElement).toBe(first);
            await pressTab(true);
            expect(document.activeElement).toBe(last);
            wrapper.unmount();
        }),
    );
});

describe('useEsc 多弹窗修复', () => {
    test('两个弹窗同开，Esc 只关闭栈顶一个（另一层保持）', async () => {
        const wrapper = mount(
            {
                components: { FModal },
                template: `
                    <div>
                        <FModal :show="true" title="A" />
                        <FModal :show="true" title="B" />
                    </div>
                `,
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        await wait(50);
        expect(document.querySelectorAll('.fes-modal-wrapper').length).toBe(2);
        await pressEsc();
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
                        <FModal :show="true" title="A" />
                        <FModal :show="showB" title="B" @update:show="showB = $event" />
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
        await pressEsc();
        const modals = wrapper.findAllComponents(FModal as any);
        expect((modals[1].emitted('update:show') ?? []).length).toBe(1);
        expect((modals[0].emitted('update:show') ?? []).length).toBe(0);
        // showB 置 false 后（B 出栈），第二次 Esc 关 A
        (wrapper.vm as any).showB = false;
        await nextTick();
        await wait(50);
        await pressEsc();
        expect(
            (wrapper.findAllComponents(FModal as any)[0].emitted('update:show') ?? [])
                .length,
        ).toBe(1);
        wrapper.unmount();
    });

    test('下层弹层重新打开 escClosable 不会抢占栈顶', async () => {
        // A 先开（escClosable=false，不入栈也不该抢 Esc），B 后开；
        // 随后把 A 的 escClosable 打开——若实现按 escClosable 增删栈，
        // A 会被重新 push 到栈顶，抢走本该属于 B 的 Esc
        const wrapper = mount(
            {
                components: { FModal },
                template: `
                    <div>
                        <FModal
                            :show="true"
                            title="A"
                            :escClosable="closableA"
                            @update:show="showA = $event"
                        />
                        <FModal
                            :show="true"
                            title="B"
                            @update:show="showB = $event"
                        />
                    </div>
                `,
                data() {
                    return { closableA: false, showA: true, showB: true };
                },
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        await wait(50);
        (wrapper.vm as any).closableA = true;
        await nextTick();
        await wait(50);
        await pressEsc();
        const modals = wrapper.findAllComponents(FModal as any);
        expect((modals[0].emitted('update:show') ?? []).length).toBe(0);
        expect((modals[1].emitted('update:show') ?? []).length).toBe(1);
        wrapper.unmount();
    });

    test('栈顶不可关闭时 Esc 被吞掉，不下沉到下层', async () => {
        const wrapper = mount(
            {
                components: { FModal },
                template: `
                    <div>
                        <FModal :show="true" title="A" @update:show="showA = $event" />
                        <FModal
                            :show="true"
                            title="B"
                            :escClosable="false"
                            @update:show="showB = $event"
                        />
                    </div>
                `,
                data() {
                    return { showA: true, showB: true };
                },
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        await wait(50);
        await pressEsc();
        const modals = wrapper.findAllComponents(FModal as any);
        // 用户看到的是最上层 B，B 不可关闭时不应把下层 A 关掉
        expect((modals[0].emitted('update:show') ?? []).length).toBe(0);
        expect((modals[1].emitted('update:show') ?? []).length).toBe(0);
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

    test('只配 name（无 value）的 tab 也能选中、可聚焦并参与方向键导航', async () => {
        const wrapper = mount(FTabs as any, {
            slots: {
                default: () => [
                    h(FTabPane as any, { key: '1', name: 'A' }, () => '内容A'),
                    h(FTabPane as any, { key: '2', name: 'B' }, () => '内容B'),
                ],
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        const tabs = wrapper.findAll('[role="tab"]');
        expect(tabs.length).toBe(2);
        // 首个 tab 被选为默认值（此前无 value 时没有任何 tab 选中）
        expect(tabs[0].attributes('aria-selected')).toBe('true');
        expect(tabs[0].attributes('tabindex')).toBe('0');
        // 只渲染当前 pane（此前 value/currentValue 同为 undefined，全部 pane 同时渲染）
        const panes = wrapper.findAll(`.${getPrefixCls('tabs')}-tab-pane`);
        expect(panes.length).toBe(1);
        expect(panes[0].text()).toBe('内容A');
        // 方向键切到 B（name 作为标识参与导航）
        await tabs[0].trigger('keydown', { key: 'ArrowRight' });
        await nextTick();
        const emitted = wrapper.emitted('update:modelValue')!;
        expect(emitted[emitted.length - 1][0]).toBe('B');
        expect(
            wrapper.findAll(`.${getPrefixCls('tabs')}-tab-pane`)[0].text(),
        ).toBe('内容B');
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

    test('无 label 时不注入 labelId（避免指向不存在的元素）', async () => {
        const wrapper = mount(
            {
                components: { FForm, FFormItem, FInput },
                template: `
                    <FForm :model="{}">
                        <FFormItem prop="user">
                            <FInput />
                        </FFormItem>
                    </FForm>
                `,
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        expect(wrapper.find('.fes-form-item-label').exists()).toBe(false);
        const input = wrapper.find('input');
        expect(input.attributes('aria-labelledby')).toBeUndefined();
        wrapper.unmount();
    });

    test('label 插槽同样产生 id 关联', async () => {
        const wrapper = mount(
            {
                components: { FForm, FFormItem, FInput },
                template: `
                    <FForm :model="{}">
                        <FFormItem prop="user">
                            <template #label>
                                <span class="custom-label">自定义标签</span>
                            </template>
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

    test('错误信息用 role=alert 播报', async () => {
        const wrapper = mount(
            {
                components: { FForm, FFormItem, FInput },
                data() {
                    return { model: { user: '' } };
                },
                template: `
                    <FForm :model="model">
                        <FFormItem
                            label="用户名"
                            prop="user"
                            :rules="[{ required: true, message: '请输入用户名' }]"
                        >
                            <FInput />
                        </FFormItem>
                    </FForm>
                `,
            },
            { attachTo: document.body } as any,
        );
        await nextTick();
        const input = wrapper.find('input');
        await input.setValue('');
        await input.trigger('blur');
        await nextTick();
        await wait(50);
        const error = wrapper.find('.fes-form-item-error');
        expect(error.exists()).toBe(true);
        // role=alert 本身即 assertive live region，不再叠加 aria-live=polite
        expect(error.attributes('role')).toBe('alert');
        expect(error.attributes('aria-live')).toBeUndefined();
        wrapper.unmount();
    });
});
