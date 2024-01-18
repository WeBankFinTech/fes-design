export type SelectOptionValue = string | number | boolean | object;

export interface SelectOption {
    value: SelectOptionValue;
    label: string | number;
}

export interface SelectTagWithCollapse extends SelectOption {
    closable: boolean;
    isCollapsed?: boolean;
    collapsedOptions?: SelectTagWithCollapse[];
}

export interface RenderTagParam {
    option: SelectOption;
    handleClose: () => void;
}
