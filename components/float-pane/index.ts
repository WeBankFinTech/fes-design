import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import FloatPane from './float-pane';

type ModalType = SFCWithInstall<typeof FloatPane>;

export { floatPaneProps } from './props';
export type { FloatPaneProps } from './props';
export const FFloatPane = withInstall<ModalType>(FloatPane as ModalType);

export default FFloatPane;
