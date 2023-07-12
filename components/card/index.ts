import { withInstall } from '../_util/withInstall';
import Card from './card.vue';

import { cardProps } from './props';
import type {
    SFCWithInstall,
    ExtractPublicPropTypes,
} from '../_util/interface';

export { cardProps } from './props';
export type CardProps = ExtractPublicPropTypes<typeof cardProps>;

type CardType = SFCWithInstall<typeof Card>;
export const FCard = withInstall<CardType>(Card as CardType);

export default FCard;
