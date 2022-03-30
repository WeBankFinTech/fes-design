import { OptionValue } from './interface';

export enum EXPAND_TRIGGER {
    CLICK = 'click',
    HOVER = 'hover',
}

export const DEFAULT_CONFIG = {
    expandTrigger: EXPAND_TRIGGER.CLICK,
    emitPath: false, // wether to emit an array of all levels value in which node is located
    valueField: 'value',
    labelField: 'label',
    childrenField: 'children',
    disabledField: 'disabled',
};

export const EVENT_CODE = {
    TAB: 'Tab',
    ENTER: 'Enter',
    LEFT: 'ArrowLeft', // 37
    UP: 'ArrowUp', // 38
    RIGHT: 'ArrowRight', // 39
    DOWN: 'ArrowDown', // 40
    ESC: 'Escape',
};

export enum CHECK_STRATEGY {
    ALL = 'all',
    PARENT = 'parent',
    CHILD = 'child',
}

// 如果不设置 v-modal，则取到的值为 false，所以增加这种场景的判断
export const VALUE_UNDEFINED = (<unknown>false) as OptionValue | OptionValue[];
