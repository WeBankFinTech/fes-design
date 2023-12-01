import { withInstall, withNoopInstall } from '../_util/withInstall';
import Select from './select.vue';
import Option from './option';
import SelectGroupOption from './groupOption';

import type { SFCWithInstall } from '../_util/interface';

type SelectType = SFCWithInstall<typeof Select>;
type OptionType = SFCWithInstall<typeof Option>;
type SelectGroupOptionType = SFCWithInstall<typeof SelectGroupOption>;

export { selectProps } from './props';
export type { SelectProps } from './props';
export const FSelect = withInstall<SelectType>(Select as SelectType, {
    Option,
    SelectGroupOption,
});

export { optionProps } from './option';
export type { OptionProps } from './option';
export const FOption = withNoopInstall<OptionType>(Option as OptionType);

export { selectGroupOptionProps } from './groupOption';
export type { SelectGroupOptionProps } from './groupOption';
export const FSelectGroupOption = withNoopInstall<SelectGroupOptionType>(
    SelectGroupOption as SelectGroupOptionType,
);

export default FSelect;
