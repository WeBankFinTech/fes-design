import { withInstall } from '../_util/withInstall';
import Tag from './tag.vue';

import type { SFCWithInstall } from '../_util/interface';

type TagType = SFCWithInstall<typeof Tag>;

export { tagProps } from './props';
export type { TagProps } from './props';
export const FTag = withInstall<TagType>(Tag as TagType);

export default FTag;
