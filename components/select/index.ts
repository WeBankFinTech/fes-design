import { withInstall, withNoopInstall } from '../_util/withInstall';
import Select from './select.vue';
import Option from './option';

import type { SFCWithInstall } from '../_util/interface';

type SelectType = SFCWithInstall<typeof Select>;
type OptionType = SFCWithInstall<typeof Option>;

export { selectProps } from './props';
export type { SelectProps } from './props';
export const FSelect = withInstall<SelectType>(Select as SelectType, {
    Option,
});

export { optionProps } from './option';
export type { OptionProps } from './option';
export const FOption = withNoopInstall<OptionType>(Option as OptionType);

export default FSelect;
