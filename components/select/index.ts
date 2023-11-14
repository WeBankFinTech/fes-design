import { withInstall, withNoopInstall } from '../_util/withInstall';
import Select from './select.vue';
import Option from './option';
import OptionGroup from './optionGroup';

import type { SFCWithInstall } from '../_util/interface';

type SelectType = SFCWithInstall<typeof Select>;
type OptionType = SFCWithInstall<typeof Option>;
type OptionGroupType = SFCWithInstall<typeof OptionGroup>;

export { selectProps } from './props';
export type { SelectProps } from './props';
export const FSelect = withInstall<SelectType>(Select as SelectType, {
    Option,
    OptionGroup,
});

export { optionProps } from './option';
export type { OptionProps } from './option';
export const FOption = withNoopInstall<OptionType>(Option as OptionType);

export { optionGroupProps } from './optionGroup';
export type { OptionGroupProps } from './optionGroup';
export const FOptionGroup = withNoopInstall<OptionGroupType>(
    OptionGroup as OptionGroupType,
);

export default FSelect;
