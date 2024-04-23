import type { InjectionKey } from 'vue';
import type { ParentGroupInjection } from '../_util/use/useSelect';
import type { RadioValue } from '../radio/props';
import type { RadioGroupInnerProps } from './props';

export const COMPONENT_NAME = 'FRadioGroup';

export const radioGroupKey: InjectionKey<
    ParentGroupInjection<RadioValue, RadioGroupInnerProps>
> = Symbol('FRadioGroup');
