import { withInstall } from '../_util/withInstall';
import Transfer from './transfer';
import type { SFCWithInstall } from '../_util/interface';

export type { TransferProps } from './props';
export { transferProps } from './props';

type TransferType = SFCWithInstall<typeof Transfer>;

export const FTransfer = withInstall<TransferType>(Transfer as TransferType);
export default FTransfer;
