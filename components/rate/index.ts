import { withInstall } from '../_util/withInstall';
import Rate from './rate';
import type { SFCWithInstall } from '../_util/interface';

export { rateProps } from './props';
export type { RateProps } from './props';

type RateType = SFCWithInstall<typeof Rate>;
export const FRate = withInstall<RateType>(Rate as RateType);

export default FRate;
