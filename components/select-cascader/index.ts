import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import SelectCascader from './selectCascader.vue';

type SelectCascaderType = SFCWithInstall<typeof SelectCascader>;

export { selectCascaderProps } from './selectCascader.vue';
export type { SelectCascaderProps } from './selectCascader.vue';
export const FSelectCascader = withInstall<SelectCascaderType>(
    SelectCascader as SelectCascaderType,
);

export default FSelectCascader;
