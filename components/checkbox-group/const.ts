import type { InjectionKey } from 'vue';
import type { ParentGroupInjection } from '../_util/use/useSelect';
import type { CheckboxValue } from '../checkbox/props';
import type { CheckboxGroupInnerProps } from './props';

export const COMPONENT_NAME = 'FCheckboxGroup';

export const checkboxGroupKey: InjectionKey<
    ParentGroupInjection<CheckboxValue, CheckboxGroupInnerProps>
> = Symbol('FCheckboxGroup');
