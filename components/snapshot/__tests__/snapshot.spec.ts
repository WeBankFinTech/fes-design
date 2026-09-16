/**
 * 展示型组件默认渲染快照（技能第九节-2，naive-ui/ant-design 模式）
 *
 * 每组件一条「默认渲染」快照，防 CSS class 意外变更：
 * 类名结构变动时快照 diff 立刻暴露，评审时一眼判断是否有意为之。
 * 仅覆盖展示型组件（无复杂内部状态，快照稳定）；
 * 交互型组件（select/table 等）不进快照——用例驱动断言更适合。
 */
import { mount } from '@vue/test-utils';
import {
    FAlert,
    FAvatar,
    FBadge,
    FBreadcrumb,
    FBreadcrumbItem,
    FButton,
    FButtonGroup,
    FCard,
    FDivider,
    FEmpty,
    FImage,
    FLink,
    FProgress,
    FSkeleton,
    FSpace,
    FSpin,
    FStep,
    FSteps,
    FTag,
    FText,
    FTimeline,
} from '../../index';

describe('展示型组件默认渲染快照', () => {
    test('FAlert', () => {
        const wrapper = mount(FAlert, { props: { message: '提示内容' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FAvatar', () => {
        const wrapper = mount(FAvatar);
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FBadge', () => {
        const wrapper = mount(FBadge, {
            props: { value: 5 },
            slots: { default: '<span>宿主</span>' },
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FBreadcrumb', () => {
        const wrapper = mount({
            components: { FBreadcrumb, FBreadcrumbItem },
            template:
                '<FBreadcrumb><FBreadcrumbItem>首页</FBreadcrumbItem><FBreadcrumbItem>列表</FBreadcrumbItem></FBreadcrumb>',
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FButton', () => {
        const wrapper = mount(FButton, { slots: { default: '按钮' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FButtonGroup', () => {
        const wrapper = mount({
            components: { FButton, FButtonGroup },
            template: '<FButtonGroup><FButton>一</FButton><FButton>二</FButton></FButtonGroup>',
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FCard', () => {
        const wrapper = mount(FCard, { slots: { default: '内容' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FDivider', () => {
        const wrapper = mount(FDivider);
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FEmpty（渐变 ID 含时间戳，序列化前归一化）', () => {
        const wrapper = mount(FEmpty);
        // SVG 渐变 id 每次渲染带 Date.now() 后缀，归一化后快照才稳定
        const html = wrapper.html().replace(/-(\d{13})/g, '-NORMALIZED');
        expect(html).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FImage', () => {
        const wrapper = mount(FImage, {
            props: { src: 'test-src' },
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FLink', () => {
        const wrapper = mount(FLink, { slots: { default: '链接' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FProgress', () => {
        const wrapper = mount(FProgress, { props: { percentage: 50 } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FSkeleton', () => {
        const wrapper = mount(FSkeleton);
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FSpace', () => {
        const wrapper = mount(FSpace, {
            slots: { default: '<span>一</span><span>二</span>' },
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FSpin', () => {
        const wrapper = mount(FSpin);
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FSteps', () => {
        const wrapper = mount({
            components: { FStep, FSteps },
            template:
                '<FSteps :active="1"><FStep /><FStep /></FSteps>',
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FTag', () => {
        const wrapper = mount(FTag, { slots: { default: '标签' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FText', () => {
        const wrapper = mount(FText, { slots: { default: '文本' } });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });

    test('FTimeline', () => {
        const wrapper = mount(FTimeline, {
            props: { data: [{ title: '节点一' }, { title: '节点二' }] },
        });
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.unmount();
    });
});
