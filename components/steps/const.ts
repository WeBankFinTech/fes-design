import type { StepsInject } from './interface';
import type { InjectionKey } from 'vue';

export const PROVIDE_KEY: InjectionKey<StepsInject> = Symbol('FSteps');

export const COMPONENT_NAME = {
    STEPS: 'FSteps',
    STEP: 'FStep',
};

export const STATUS = {
    WAIT: 'wait',
    PROCESS: 'process',
    FINISH: 'finish',
    ERROR: 'error',
} as const;

// 类型
export const TYPE = ['default', 'navigation'] as const;
