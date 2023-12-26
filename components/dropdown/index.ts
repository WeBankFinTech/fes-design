import { withInstall } from '../_util/withInstall';
import Dropdown from './dropdown';

import type { SFCWithInstall } from '../_util/interface';

type DropdownType = SFCWithInstall<typeof Dropdown>;
export const FDropdown = withInstall<DropdownType>(Dropdown as DropdownType);

export { dropdownProps } from './props';
export type { DropdownProps } from './props';

export default FDropdown;
