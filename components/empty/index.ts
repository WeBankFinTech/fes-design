import { withInstall } from '../_util/withInstall';
import Empty from './empty.vue';
import type { SFCWithInstall } from '../_util/interface';

type EmptyType = SFCWithInstall<typeof Empty>;

export { emptyProps } from './props';
export type { EmptyProps } from './props';
export const FEmpty = withInstall<EmptyType>(Empty as EmptyType);

export default FEmpty;
