import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Switch from './switch.vue';

type SwitchType = SFCWithInstall<typeof Switch>;

export { switchProps } from './switch.vue';
export type { SwitchProps } from './switch.vue';
export const FSwitch = withInstall<SwitchType>(Switch as SwitchType);

export default FSwitch;
