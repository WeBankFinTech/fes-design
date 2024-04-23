import { withInstall } from '../_util/withInstall';
import type {
    ExtractPublicPropTypes,
    SFCWithInstall,
} from '../_util/interface';
import Card from './card.vue';

import { type cardProps } from './props';

export { cardProps } from './props';
export type CardProps = ExtractPublicPropTypes<typeof cardProps>;

type CardType = SFCWithInstall<typeof Card>;
export const FCard = withInstall<CardType>(Card as CardType);

export default FCard;
