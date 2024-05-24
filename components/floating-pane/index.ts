import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import FloatingPane from './floating-pane';

type ModalType = SFCWithInstall<typeof FloatingPane>;

export { floatingPaneProps } from './props';
export type { FloatingPaneProps } from './props';
export const FFloatingPane = withInstall<ModalType>(FloatingPane as ModalType);

export default FFloatingPane;
