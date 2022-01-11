import type { WritableComputedRef, Ref } from 'vue';
import type { StepsProps } from './steps';

export interface StepsInject {
    current: WritableComputedRef<any>;
    updateCurrent: (val: any) => void;
    props: StepsProps;
    parentDomRef: Ref<HTMLElement | undefined>;
}
