import type {
    ComponentObjectPropsOptions,
    PropType,
    SlotsType,
} from 'vue';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import type {
    ComponentEmit,
    ExtractPublicPropTypes,
} from '../_util/interface';

export interface FileItem extends File {
    uid?: number | string;
}

const commonProps = {
    modelValue: {
        type: Array as PropType<FileItem[]>,
        default: (): FileItem[] => [],
    },
    accept: {
        type: Array as PropType<string[]>,
        default: (): string[] => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

// ------ Default Props ------

export const inputFileProps = {
    ...commonProps,
} as const satisfies ComponentObjectPropsOptions;

export type InputFileProps = ExtractPublicPropTypes<typeof inputFileProps>;

// ------ Dragger Props ------

export const inputFileDraggerProps = {
    ...commonProps,
    onFileTypeInvalid: {
        type: Function as PropType<(files: File[]) => void>,
    },
} as const satisfies ComponentObjectPropsOptions;

export type InputFileDraggerProps = ExtractPublicPropTypes<
    typeof inputFileDraggerProps
>;

// ------ Emit ------
export const EMIT_EVENTS = [UPDATE_MODEL_EVENT, CHANGE_EVENT] as const;
export type InputFileEmit = ComponentEmit<typeof EMIT_EVENTS>;

// ------ Slots ------
export interface InputFileSlotsParams {
    default: Record<string, never>;
    fileList: {
        files: File[];
    };
}

export type InputFileSlots = SlotsType<InputFileSlotsParams>;
