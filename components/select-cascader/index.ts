import { withInstall } from '../_util/withInstall';
import SelectCascader from './selectCascader.vue';

import type { SFCWithInstall } from '../_util/interface';

type SelectCascaderType = SFCWithInstall<typeof SelectCascader>;

export { selectCascaderProps } from './selectCascader.vue';
export type { SelectCascaderProps } from './selectCascader.vue';
export const FSelectCascader = withInstall<SelectCascaderType>(
    SelectCascader as SelectCascaderType,
);

export default FSelectCascader;
