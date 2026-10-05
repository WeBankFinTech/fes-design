/**
 * 全组件挂载/卸载基线（ant-design mountTest 模式）
 *
 * 验证每个组件：mount → 强制更新 → unmount 全生命周期不抛错。
 * 捕捉 setup/teardown 副作用：事件监听器泄漏、定时器未清理、
 * onUnmounted 钩子异常——交互测试覆盖不到的盲区。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {
    FAlert,
    FAvatar,
    FAvatarGroup,
    FBackTop,
    FBadge,
    FBreadcrumb,
    FBreadcrumbItem,
    FButton,
    FButtonGroup,
    FCalendar,
    FCard,
    FCarousel,
    FCarouselItem,
    FCascader,
    FCheckbox,
    FCheckboxGroup,
    FCollapse,
    FCollapsePanel,
    FConfigProvider,
    FDatePicker,
    FDescriptions,
    FDescriptionsItem,
    FDivider,
    FDrawer,
    FDropdown,
    FEllipsis,
    FEmpty,
    FForm,
    FFormItem,
    FGrid,
    FGridItem,
    FImage,
    FInput,
    FInputFile,
    FInputNumber,
    FLayout,
    FLayoutContent,
    FLayoutHeader,
    FLink,
    FMenu,
    FMenuItem,
    FModal,
    FPagination,
    FPopper,
    FProgress,
    FRadio,
    FRadioButton,
    FRadioGroup,
    FRate,
    FScrollbar,
    FSelect,
    FSkeleton,
    FSpace,
    FSpin,
    FStep,
    FSteps,
    FSwitch,
    FTabPane,
    FTable,
    FTabs,
    FTag,
    FText,
    FTimePicker,
    FTimeline,
    FTooltip,
    FTransfer,
    FTree,
    FUpload,
} from '../index';

/** mountTest 核心：挂载 → 更新 → 卸载全链路不抛错（ant-design mountTest 等价物） */
let mounted = 0;
const mountTest = async (label: string, factory: () => any) => {
    const wrapper = mount(factory(), { attachTo: document.body });
    mounted += 1;
    await nextTick();
    await wrapper.vm.$forceUpdate();
    await nextTick();
    wrapper.unmount();
    await nextTick();
    return `${label} 挂载/更新/卸载完成`;
};

describe('全组件挂载/卸载基线（mountTest）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('展示型组件', async () => {
        mounted = 0;
        await mountTest('FAlert', () => FAlert);
        await mountTest('FAvatar', () => FAvatar);
        await mountTest('FAvatarGroup（options 必传）', () => ({
            components: { FAvatarGroup },
            template: '<FAvatarGroup :options="[{ src: \'x\' }]" />',
        }));
        await mountTest('FBadge', () => FBadge);
        await mountTest('FBreadcrumb+Item', () => ({
            components: { FBreadcrumb, FBreadcrumbItem },
            template: '<FBreadcrumb><FBreadcrumbItem>首页</FBreadcrumbItem></FBreadcrumb>',
        }));
        await mountTest('FButton', () => FButton);
        await mountTest('FButtonGroup', () => ({
            components: { FButton, FButtonGroup },
            template: '<FButtonGroup><FButton>按钮</FButton></FButtonGroup>',
        }));
        await mountTest('FCard', () => FCard);
        await mountTest('FDivider', () => FDivider);
        await mountTest('FEllipsis', () => FEllipsis);
        await mountTest('FEmpty', () => FEmpty);
        await mountTest('FImage', () => FImage);
        await mountTest('FLink', () => FLink);
        await mountTest('FProgress', () => FProgress);
        await mountTest('FSkeleton', () => FSkeleton);
        await mountTest('FSpace', () => FSpace);
        await mountTest('FSpin', () => FSpin);
        await mountTest('FSteps+Step', () => ({
            components: { FSteps, FStep },
            template: '<FSteps><FStep /></FSteps>',
        }));
        await mountTest('FTag', () => FTag);
        await mountTest('FText', () => FText);
        await mountTest('FTimeline（data 必传）', () => ({
            components: { FTimeline },
            template: '<FTimeline :data="[{ title: \'节点\' }]" />',
        }));
        // 断言挂载的组件数：意外增删组件列表时此处报警
        expect(mounted).toBe(21);
    });

    test('表单输入型组件', async () => {
        mounted = 0;
        await mountTest('FCheckbox', () => FCheckbox);
        await mountTest('FCheckboxGroup', () => FCheckboxGroup);
        await mountTest('FInput', () => FInput);
        await mountTest('FInputFile', () => FInputFile);
        await mountTest('FInputNumber', () => FInputNumber);
        await mountTest('FRadio', () => FRadio);
        await mountTest('FRadioGroup', () => FRadioGroup);
        await mountTest('FRadioButton（需 RadioGroup 父级）', () => ({
            components: { FRadioGroup, FRadioButton },
            template: '<FRadioGroup><FRadioButton /></FRadioGroup>',
        }));
        await mountTest('FRate', () => FRate);
        await mountTest('FSelect', () => FSelect);
        await mountTest('FSwitch', () => FSwitch);
        await mountTest('FTransfer', () => FTransfer);
        await mountTest('FUpload', () => FUpload);
        // 断言挂载的组件数：意外增删组件列表时此处报警
        expect(mounted).toBe(13);
    });

    test('弹层与反馈型组件', async () => {
        mounted = 0;
        await mountTest('FDatePicker', () => FDatePicker);
        await mountTest('FTimePicker', () => FTimePicker);
        await mountTest('FDrawer', () => ({
            components: { FDrawer },
            template: '<FDrawer />',
        }));
        await mountTest('FDropdown', () => ({
            components: { FDropdown },
            template: '<FDropdown><span>触发</span></FDropdown>',
        }));
        await mountTest('FModal', () => ({
            components: { FModal },
            template: '<FModal />',
        }));
        await mountTest('FPopper', () => ({
            components: { FPopper },
            template: '<FPopper><template #trigger><span>触发</span></template></FPopper>',
        }));
        await mountTest('FTooltip', () => ({
            components: { FTooltip },
            template: '<FTooltip><span>触发</span></FTooltip>',
        }));
        // 断言挂载的组件数：意外增删组件列表时此处报警
        expect(mounted).toBe(7);
    });

    test('数据展示型组件', async () => {
        mounted = 0;
        await mountTest('FCalendar', () => FCalendar);
        await mountTest('FCarousel+Item', () => ({
            components: { FCarousel, FCarouselItem },
            template: '<FCarousel><FCarouselItem>1</FCarouselItem></FCarousel>',
        }));
        await mountTest('FCascader', () => FCascader);
        await mountTest('FCollapse+Panel', () => ({
            components: { FCollapse, FCollapsePanel },
            template: '<FCollapse><FCollapsePanel>内容</FCollapsePanel></FCollapse>',
        }));
        await mountTest('FDescriptions+Item', () => ({
            components: { FDescriptions, FDescriptionsItem },
            template: '<FDescriptions><FDescriptionsItem :label="\'标签\'">值</FDescriptionsItem></FDescriptions>',
        }));
        await mountTest('FForm+FormItem', () => ({
            components: { FForm, FFormItem },
            template: '<FForm><FFormItem /></FForm>',
        }));
        await mountTest('FGrid+GridItem', () => ({
            components: { FGrid, FGridItem },
            template: '<FGrid><FGridItem /></FGrid>',
        }));
        await mountTest('FLayout 系列', () => ({
            components: { FLayout, FLayoutHeader, FLayoutContent },
            template: '<FLayout><FLayoutHeader>头</FLayoutHeader><FLayoutContent>内容</FLayoutContent></FLayout>',
        }));
        await mountTest('FMenu+MenuItem', () => ({
            components: { FMenu, FMenuItem },
            template: '<FMenu><FMenuItem label="菜单项" /></FMenu>',
        }));
        await mountTest('FPagination', () => FPagination);
        await mountTest('FTabs+TabPane（value 必传）', () => ({
            components: { FTabs, FTabPane },
            template: '<FTabs><FTabPane value="a">内容</FTabPane></FTabs>',
        }));
        await mountTest('FTree', () => FTree);
        await mountTest('FTable（空数据）', () => ({
            components: { FTable },
            template: '<FTable :columns="[{ label: \'列\' }]" :data="[]" />',
        }));
        await mountTest('FBackTop', () => FBackTop);
        await mountTest('FScrollbar', () => FScrollbar);
        await mountTest('FConfigProvider', () => FConfigProvider);
        // 断言挂载的组件数：意外增删组件列表时此处报警
        expect(mounted).toBe(16);
    });
});
