import { withInstall } from '../_util/withInstall';
import Modal from './modal';
import Api from './modalApi';

import type { SFCWithInstall } from '../_util/interface';

Object.keys(Api).forEach((key) => {
    Modal[key] = Api[key as keyof typeof Api];
});

type ModalType = SFCWithInstall<typeof Modal> & typeof Api;

export { modalProps } from './modal';
export type { ModalProps } from './modal';
export const FModal = withInstall<ModalType>(Modal as ModalType);

export default FModal;
