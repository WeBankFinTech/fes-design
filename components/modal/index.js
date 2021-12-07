import { withInstall } from '../_util/withInstall';
import Modal from './modal';
import Api from './modalApi';

Object.keys(Api).forEach((key) => { Modal[key] = Api[key]; });

export const FModal = withInstall(Modal);

export default FModal;
