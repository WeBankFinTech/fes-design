import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Modal from './modal';
import Api from './modalApi';

Object.keys(Api).forEach((key) => {
    Modal[key] = Api[key as keyof typeof Api];
});

type ModalType = SFCWithInstall<typeof Modal> & typeof Api;

export { modalProps } from './props';
export type { ModalProps } from './props';
export const FModal = withInstall<ModalType>(Modal as ModalType);

export default FModal;
