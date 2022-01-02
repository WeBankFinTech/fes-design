import { withInstall, withNoopInstall } from '../_util/withInstall';
import Select from './select.vue';
import Option from './option.vue';

export const FSelect = withInstall(Select, { Option });
export const FOption = withNoopInstall(Option);

export default FSelect;
