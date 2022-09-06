import type { App } from 'vue';
import version from './version';
import { FAlert } from './alert';
import { FButton } from './button';
import { FCheckbox } from './checkbox';
import { FCheckboxGroup } from './checkbox-group';
import { FConfigProvider } from './config-provider';
import { FDivider } from './divider';
import { FDraggable } from './draggable';
import { FDropdown } from './dropdown';
import { FEllipsis } from './ellipsis';
import { FGrid, FGridItem } from './grid';
import { FInput } from './input';
import { FInputNumber } from './input-number';
import { FLayout, FAside, FFooter, FHeader, FMain } from './layout';
import { FMenu, FMenuGroup, FMenuItem, FSubMenu } from './menu';
import FMessage from './message';
import { FModal } from './modal';
import { FPopper } from './popper';
import { FRadio } from './radio';
import { FRadioGroup } from './radio-group';
import { FScrollbar } from './scrollbar';
import { FSelect, FOption } from './select';
import { FSpin } from './spin';
import { FSteps, FStep } from './steps';
import { FSwitch } from './switch';
import { FTable, FTableColumn } from './table';
import { FTabs, FTabPane } from './tabs';
import { FTag } from './tag';
import { FTimePicker } from './time-picker';
import { FDatePicker } from './date-picker';
import { FTooltip } from './tooltip';
import { FTree } from './tree';
import { FUpload, FUploadDragger } from './upload';
import { FPagination } from './pagination';
import { FImage, FPreviewGroup } from './image';
import { FForm, FFormItem } from './form';
import { FCarousel, FCarouselItem } from './carousel';
import { FVirtualList } from './virtual-list';
import { FDrawer } from './drawer';
import { FSelectTree } from './select-tree';
import { FSpace } from './space';
import { FSkeleton } from './skeleton';
import { FCascader } from './cascader';
import { FSelectCascader } from './select-cascader';
import { FDescriptions, FDescriptionsItem } from './descriptions';

export * from './locales';

const components = [
    FAlert,
    FButton,
    FCheckbox,
    FCheckboxGroup,
    FConfigProvider,
    FDivider,
    FDraggable,
    FDropdown,
    FEllipsis,
    FGrid,
    FGridItem,
    FInput,
    FInputNumber,
    FLayout,
    FAside,
    FFooter,
    FHeader,
    FMain,
    FMenu,
    FMenuGroup,
    FMenuItem,
    FSubMenu,
    FModal,
    FPopper,
    FRadio,
    FRadioGroup,
    FScrollbar,
    FSelect,
    FOption,
    FSpin,
    FSteps,
    FStep,
    FSwitch,
    FTable,
    FTableColumn,
    FTabs,
    FTabPane,
    FTag,
    FTimePicker,
    FDatePicker,
    FTooltip,
    FTree,
    FUpload,
    FUploadDragger,
    FPagination,
    FImage,
    FPreviewGroup,
    FForm,
    FFormItem,
    FCarousel,
    FCarouselItem,
    FVirtualList,
    FDrawer,
    FSelectTree,
    FSpace,
    FSkeleton,
    FCascader,
    FSelectCascader,
    FDescriptions,
    FDescriptionsItem,
];
const install = function (app: App) {
    components.forEach((component) => {
        app.use(component);
    });
    return app;
};

export {
    version,
    install,
    FAlert,
    FButton,
    FCheckbox,
    FCheckboxGroup,
    FConfigProvider,
    FDivider,
    FDraggable,
    FDropdown,
    FEllipsis,
    FGrid,
    FGridItem,
    FInput,
    FInputNumber,
    FLayout,
    FAside,
    FFooter,
    FHeader,
    FMain,
    FMenu,
    FMenuGroup,
    FMenuItem,
    FSubMenu,
    FMessage,
    FModal,
    FPopper,
    FRadio,
    FRadioGroup,
    FScrollbar,
    FSelect,
    FOption,
    FSpin,
    FSteps,
    FStep,
    FSwitch,
    FTable,
    FTableColumn,
    FTabs,
    FTabPane,
    FTag,
    FTimePicker,
    FDatePicker,
    FTooltip,
    FTree,
    FUpload,
    FUploadDragger,
    FPagination,
    FImage,
    FPreviewGroup,
    FForm,
    FFormItem,
    FCarousel,
    FCarouselItem,
    FVirtualList,
    FDrawer,
    FSelectTree,
    FSpace,
    FSkeleton,
    FCascader,
    FSelectCascader,
    FDescriptions,
    FDescriptionsItem,
};
export default {
    version,
    install,
};
