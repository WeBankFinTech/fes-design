/* @remove-on-es-build-begin */
// this file is not used if use https://github.com/ant-design/babel-plugin-import
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
import { FTable, FColumn } from './table';
import { FTabs, FTabPane } from './tabs';
import { FTag } from './tag';
import { FCascader } from './cascader';
import { FTimePicker } from './time-picker';
import { FDatePicker } from './date-picker';
import { FTooltip } from './tooltip';
import { FTree } from './tree';
import { FUpload } from './upload';
import { FPagination } from './pagination';
import { FImage, FPreviewGroup } from './image';
import { FForm, FFormItem } from './form';
import { FVirtualList } from './virtual-list';
import { FDrawer } from './drawer';
import { FSelectTree } from './select-tree';

const ENV = process.env.NODE_ENV;
if (ENV !== 'production' && ENV !== 'test' && typeof console !== 'undefined' && console.warn && typeof window !== 'undefined') {
    console.warn('You are using a whole package of fes-design, ' + 'please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.');
}

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
    FColumn,
    FTabs,
    FTabPane,
    FTag,
    FCascader,
    FTimePicker,
    FDatePicker,
    FTooltip,
    FTree,
    FUpload,
    FPagination,
    FImage,
    FPreviewGroup,
    FForm,
    FFormItem,
    FCarousel,
    FCarouselItem,
    FDrawer,
    FVirtualList,
    FSelectTree,
];
const install = function (app) {
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
    FColumn,
    FTabs,
    FTabPane,
    FTag,
    FCascader,
    FTimePicker,
    FDatePicker,
    FTooltip,
    FTree,
    FUpload,
    FPagination,
    FImage,
    FPreviewGroup,
    FForm,
    FFormItem,
    FCarousel,
    FCarouselItem,
    FDrawer,
    FVirtualList,
    FSelectTree,
};
export default {
    version,
    install,
};
