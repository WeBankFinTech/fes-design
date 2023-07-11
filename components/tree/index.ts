import { withInstall } from '../_util/withInstall';
import Tree from './tree';

import type { SFCWithInstall } from '../_util/interface';

type TreeType = SFCWithInstall<typeof Tree>;

export { treeProps } from './props';
export type { TreeProps } from './props';
export const FTree = withInstall<TreeType>(Tree as TreeType);

export default FTree;
