import type { StepsInject } from './interface';
import type { InjectionKey } from 'vue';

export const PROVIDE_KEY: InjectionKey<StepsInject> = Symbol('FSteps');

export const COMPONENT_NAME = {
    STEPS: 'FSteps',
    STEP: 'FStep',
};

export enum STATUS {
    WAIT = 'wait',
    PROCESS = 'process',
    FINISH = 'finish',
    ERROR = 'error',
}

// 类型
export const TYPE = ['default', 'navigation'] as const;
