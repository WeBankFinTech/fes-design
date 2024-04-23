import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Cascader from './cascader';

export { cascaderProps } from './props';
export type { CascaderProps } from './props';

type CascaderType = SFCWithInstall<typeof Cascader>;
export const FCascader = withInstall<CascaderType>(Cascader as CascaderType);

export default FCascader;
