import { withInstall } from '../_util/withInstall';
import Switch from './switch.vue';

import type { SFCWithInstall } from '../_util/interface';

type SwitchType = SFCWithInstall<typeof Switch>;
export const FSwitch = withInstall<SwitchType>(Switch as SwitchType);

export default FSwitch;
