import { ComputedRef, Ref } from 'vue';

export type Value = string | number;
export type Position = 'left' | 'top' | 'right' | 'bottom';
export type TabCloseMode = 'hover' | 'visible';

export interface TabsInject {
    valueRef: Ref<Value>;
    closableRef: Ref<boolean>;
    closeModeRef: Ref<TabCloseMode>;
    isCard: ComputedRef<boolean>;
    tabsLength: Ref<number>;
    handleTabClick: (key: string | number) => void;
    handleClose: (key: string | number) => void;
    setDefaultValue: (value: unknown) => void;
}
