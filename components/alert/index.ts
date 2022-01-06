import { withInstall } from '../_util/withInstall';
import Alert from './alert';

import type { SFCWithInstall } from '../_util/interface';

type AlertType = SFCWithInstall<typeof Alert>;
export const FAlert = withInstall<AlertType>(Alert as AlertType);

export default FAlert;
