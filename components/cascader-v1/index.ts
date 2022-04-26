import { withInstall } from '../_util/withInstall';
import Cascader from './cascader.vue';

import type { SFCWithInstall } from '../_util/interface';

type CascaderType = SFCWithInstall<typeof Cascader>;
export const FCascaderV1 = withInstall<CascaderType>(Cascader as CascaderType);

export default FCascaderV1;
