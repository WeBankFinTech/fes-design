import { withInstall } from '../_util/withInstall';
import SelectTree from './selectTree.vue';

import type { SFCWithInstall } from '../_util/interface';

type SelectTreeType = SFCWithInstall<typeof SelectTree>;
export const FSelectTree = withInstall<SelectTreeType>(
    SelectTree as SelectTreeType,
);

export default FSelectTree;
