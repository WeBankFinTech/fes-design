import { Component, App } from 'vue';

declare module "@fesjs/fes-design" {
    export const version: string;
    export function install(app: App): App;
    export const FAlert: Component;
    export const FButton: Component;
    export const FCheckbox: Component;
    export const FCheckboxGroup: Component;
    export const FConfigProvider: Component;
    export const FDivider: Component;
    export const FDraggable: Component;
    export const FDropdown: Component;
    export const FEllipsis: Component;
    export const FGrid: Component;
    export const FGridItem: Component;
    export const FInput: Component;
    export const FInputNumber: Component;
    export const FLayout: Component;
    export const FAside: Component;
    export const FFooter: Component;
    export const FHeader: Component;
    export const FMain: Component;
    export const FMenu: Component;
    export const FMenuGroup: Component;
    export const FMenuItem: Component;
    export const FSubMenu: Component;
    export const FModal: Component;
    export const FPopper: Component;
    export const FRadio: Component;
    export const FRadioGroup: Component;
    export const FScrollbar: Component;
    export const FSelect: Component;
    export const FOption: Component;
    export const FSpin: Component;
    export const FSteps: Component;
    export const FStep: Component;
    export const FSwitch: Component;
    export const FTable: Component;
    export const FColumn: Component;
    export const FTabs: Component;
    export const FTabPane: Component;
    export const FTag: Component;
    export const FCascader: Component;
    export const FTimePicker: Component;
    export const FDatePicker: Component;
    export const FTooltip: Component;
    export const FTree: Component;
    export const FUpload: Component;
    export const FPagination: Component;
    export const FImage: Component;
    export const FPreviewGroup: Component;
    export const FForm: Component;
    export const FFormItem: Component;
    export const FDrawer: Component;
}

