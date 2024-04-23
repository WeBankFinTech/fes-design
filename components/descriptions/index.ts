import { withInstall, withNoopInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Descriptions from './descriptions';
import DescriptionsItem from './descriptionsItem';

type DescriptionsType = SFCWithInstall<typeof Descriptions>;
type DescriptionsItemType = SFCWithInstall<typeof DescriptionsItem>;

export { descriptionsProps } from './props';
export type { DescriptionsProps } from './props';
export const FDescriptions = withInstall<DescriptionsType>(
    Descriptions as DescriptionsType,
    {
        DescriptionsItem,
    },
);

export { descriptionsItemProps } from './props';
export type { DescriptionsItemProps } from './props';
export const FDescriptionsItem = withNoopInstall<DescriptionsItemType>(
    DescriptionsItem as DescriptionsItemType,
);

export default FDescriptions;
