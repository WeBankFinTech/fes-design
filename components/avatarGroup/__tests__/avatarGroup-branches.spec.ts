import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import FAvatarGroup from '../avatarGroup';
import FAvatar from '../../avatar';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('avatar-group');
const avatarCls = getPrefixCls('avatar');

// avatarGroup 内 FTooltip 弹层默认挂 body
afterEach(() => {
    document.body.innerHTML = '';
});

/**
 * FAvatarGroup 分支补全（全库基线 24/34，死分支）：
 * - L27[0]  option.icon 存在 → resolveComponent（非 null 左支）
 * - L35[1]  expandOnHover 开启且 name 存在 → tooltip disabled=false
 * - L48[0]  IconComponent 存在 → h(IconComponent) 渲染图标
 * - L75[1]  max < 插槽数 → shouldRenderOptionNum 取 0（res>0 假支）
 * - L81     renderHiddenTooltip：index >= 应渲染数 且 name 存在 → 进 tooltip
 * - L98[1]  expandOnHover 开启且隐藏项有 name → 折叠 tooltip disabled=false
 * - L144[1] 插槽数 >= max 时 hiddenNum === 0 → 不渲染折叠项
 */
describe('FAvatarGroup 分支补全', () => {
    test('option.icon 解析为组件并渲染图标（L27/L48 左支）', async () => {
        // 用已注册的图标组件名解析：resolveComponent 命中注册表
        const IconStub = defineComponent({
            name: 'FIconStub',
            render: () => h('i', { class: 'icon-stub' }),
        });
        const wrapper = mount(FAvatarGroup, {
            props: {
                options: [
                    { text: '张', name: '张三', icon: 'FIconStub' },
                ],
            },
            global: {
                components: { FIconStub: IconStub },
            },
        });
        await nextTick();
        await wait(30);
        const avatar = wrapper.find(`.${avatarCls}`);
        expect(avatar.exists()).toBe(true);
        // icon 分支：h(IconComponent) 渲染出图标节点
        expect(wrapper.find('.icon-stub').exists()).toBe(true);
        // 文本与图标共存
        expect(avatar.text()).toContain('张');
        wrapper.unmount();
    });

    test('option 无 icon：IconComponent 为 null，不渲染图标（L27 右支）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: { options: [{ text: '李', name: '李四' }] },
        });
        await nextTick();
        await wait(30);
        const avatar = wrapper.find(`.${avatarCls}`);
        expect(avatar.text()).toContain('李');
        expect(wrapper.find('.icon-stub').exists()).toBe(false);
        wrapper.unmount();
    });

    test('expandOnHover=true 且 name 存在：hover 展示 tooltip；无 name 不展示（L35）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                expandOnHover: true,
                options: [
                    { text: 'A', name: '甲' },
                    { text: 'B' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(50);

        // 第一个头像有 name → tooltip 可用：hover 后弹层可见
        const avatars = wrapper.findAll(`.${avatarCls}`);
        expect(avatars.length).toBe(2);
        await avatars[0].trigger('mouseenter');
        await vi.waitFor(() => {
            expect(document.querySelector('.fes-tooltip') !== null).toBe(true);
        });
        expect(document.querySelector('.fes-tooltip')!.textContent).toContain(
            '甲',
        );

        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('expandOnHover 默认 false：tooltip disabled，hover 不弹层（L35 右支）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: { options: [{ text: 'A', name: '甲' }] },
            attachTo: document.body,
        });
        await nextTick();
        await wait(50);
        const avatar = wrapper.find(`.${avatarCls}`);
        await avatar.trigger('mouseenter');
        await wait(80);
        expect(document.querySelector('.fes-tooltip')).toBeNull();
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('插槽数 > max：shouldRenderOptionNum 归零，只渲染前 max 个插槽 + 折叠（L75/L144）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 2,
                options: [{ text: 'O1', name: '选项一' }],
            },
            slots: {
                default: () =>
                    [1, 2, 3].map((n) =>
                        h(FAvatar, null, { default: () => String(n) }),
                    ),
            },
        });
        await nextTick();
        await wait(30);
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 3 个插槽 >= max(2)：只渲染前 2 个 + 一个 +1 折叠（3+1-2=2? 详情见断言）
        expect(avatars.length).toBe(3);
        expect(avatars[0].text()).toBe('1');
        expect(avatars[1].text()).toBe('2');
        // 折叠数 = 插槽3 + option1 - max2 = 2
        expect(avatars[2].text()).toContain('+2');
        // option 不入渲染（shouldRenderOptionNum=0）
        expect(wrapper.text()).not.toContain('O1');
        wrapper.unmount();
    });

    test('插槽数 >= max 且 expandOnHover：shouldRenderOptionNum 归零并进隐藏 tooltip（L75 假支）', async () => {
        // res = max - slotsAvatarCount ≤ 0 → shouldRenderOptionNum 返回 0；
        // expandOnHover=true 使 renderHiddenAvatar 的 disabled 短路求值
        // renderHiddenTooltip() → L81 读取 shouldRenderOptionNum → L75 取 0 分支
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 1,
                expandOnHover: true,
                options: [{ text: 'O1', name: '选项一' }],
            },
            slots: {
                default: () =>
                    [1, 2].map((n) =>
                        h(FAvatar, null, { default: () => String(n) }),
                    ),
            },
        });
        await nextTick();
        await wait(30);
        // 插槽 2 个已占满 max=1：renderAvatarByOption(0) 反而全部渲染 option？——
        // 该路径不进 else 分支（slotsAvatarCount >= max），插槽裁剪 + 折叠
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 1 个插槽 + 折叠项（2+1-1=2）→ 共 2 个头像（首插槽 + +2）
        expect(avatars.length).toBe(2);
        expect(avatars[1].text()).toContain('+2');
        // 折叠项 hover 时 tooltip 含隐藏 option 的 name（L81 分支）
        await avatars[1].trigger('mouseenter');
        await vi.waitFor(() => {
            expect(document.querySelector('.fes-tooltip') !== null).toBe(true);
        });
        const tipText = document.querySelector('.fes-tooltip')!.textContent || '';
        expect(tipText).toContain('选项一');
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('插槽数 = max：hiddenNum === 0，不渲染折叠项（L144 假支）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: { max: 2, options: [] },
            slots: {
                default: () =>
                    [1, 2].map((n) =>
                        h(FAvatar, null, { default: () => String(n) }),
                    ),
            },
        });
        await nextTick();
        await wait(30);
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 恰好 max 个：无 +n 折叠项
        expect(avatars.length).toBe(2);
        expect(wrapper.text()).not.toContain('+');
        wrapper.unmount();
    });

    test('隐藏项 name 汇入折叠 tooltip；expandOnHover 开启时可见（L81/L98）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 1,
                expandOnHover: true,
                options: [
                    { text: 'A', name: '甲' },
                    { text: 'B', name: '乙' },
                    { text: 'C', name: '丙' },
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(60);

        const fold = wrapper
            .findAll(`.${avatarCls}`)
            .filter((a) => a.text().includes('+'));
        expect(fold.length).toBe(1);
        expect(fold[0].text()).toBe('+2');

        // hover 折叠项：tooltip 展示被隐藏者的 name（乙/丙），不含已展示的甲
        await fold[0].trigger('mouseenter');
        await vi.waitFor(() => {
            expect(document.querySelector('.fes-tooltip') !== null).toBe(true);
        });
        const tipText = document.querySelector('.fes-tooltip')!.textContent || '';
        expect(tipText).toContain('乙');
        expect(tipText).toContain('丙');
        expect(tipText).not.toContain('甲');

        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('隐藏项无 name：renderHiddenTooltip 为空 → 折叠 tooltip disabled（L98 右支）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 1,
                expandOnHover: true,
                options: [{ text: 'A' }, { text: 'B' }],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(60);
        const fold = wrapper
            .findAll(`.${avatarCls}`)
            .filter((a) => a.text().includes('+'));
        expect(fold.length).toBe(1);
        await fold[0].trigger('mouseenter');
        await wait(80);
        // 无 name → tooltip disabled，不弹层
        expect(document.querySelector('.fes-tooltip')).toBeNull();
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('插槽 + option 混用：总数小于 max 时全部渲染（L127 真支）', async () => {
        const wrapper = mount(FAvatarGroup, {
            props: {
                max: 5,
                options: [{ text: 'O1', name: '选项一' }, { text: 'O2' }],
            },
            slots: {
                default: () => [h(FAvatar, null, { default: () => '甲' })],
            },
        });
        await nextTick();
        await wait(30);
        const avatars = wrapper.findAll(`.${avatarCls}`);
        // 1 插槽 + 2 option = 3 < 5：全渲染，无折叠
        expect(avatars.length).toBe(3);
        expect(avatars[0].text()).toBe('甲');
        expect(avatars[1].text()).toBe('O1');
        expect(avatars[2].text()).toBe('O2');
        expect(wrapper.text()).not.toContain('+');
        wrapper.unmount();
    });

    test('无 options 且无插槽：渲染空容器不崩溃（L64 右支）', async () => {
        const wrapper = mount(FAvatarGroup, { props: { options: [] } });
        await nextTick();
        await wait(20);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.findAll(`.${avatarCls}`).length).toBe(0);
        wrapper.unmount();
    });

    test('已知问题：未传 options 直接挂载会抛错（renderAvatarByOption 未做空保护）', () => {
        // 源码 L23/L80 直接 props.options.map 而无 ?. 保护，optionAvatarCount
        // 虽用 ?. 但渲染函数没有 → mount 即抛 TypeError。现实影响：FAvatarGroup
        // 必须在外部保证 options 非空，否则首次渲染崩溃。属真实缺陷，
        // 是否提 issue 由负责人决定。
        // Vue 对 render 抛错会打印一次警告（console.warn/error，预期行为），
        // 静音掉以免污染 CI 输出；断言核心是 mount 抛 TypeError 本身
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => mount(FAvatarGroup, {})).toThrow(TypeError);
        warnSpy.mockRestore();
        errorSpy.mockRestore();
    });
});
