import type { Ref } from 'vue';
import type { StepsProps } from './steps';

export interface StepsInject {
    current: Ref<any>;
    updateCurrent?: (val: any) => void;
    props: StepsProps;
    parentDomRef: Ref<HTMLElement | undefined>;
    count: Ref<number>;
    onUpdate: () => void;
}
