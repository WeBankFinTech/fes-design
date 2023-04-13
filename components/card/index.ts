import { withInstall } from '../_util/withInstall';
import Card from './card.vue';

import type { SFCWithInstall } from '../_util/interface';

type CardType = SFCWithInstall<typeof Card>;
export const FCard = withInstall<CardType>(Card as CardType);

export default FCard;
