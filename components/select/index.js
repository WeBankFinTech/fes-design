import { withInstall, withNoopInstall } from '../_util/withInstall';
import Select from './select';
import Option from './option';

export const FSelect = withInstall(Select, { Option });
export const FOption = withNoopInstall(Option);

export default FSelect;
