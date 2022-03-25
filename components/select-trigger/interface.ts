export type SelectOptionValue = string | number | boolean | object;

export interface SelectOption {
    value: SelectOptionValue;
    label: string | number;
}

export interface RenderTagParam {
    option: SelectOption;
    handleClose: () => void;
}
