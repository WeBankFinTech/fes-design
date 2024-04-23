import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Tag from './tag.vue';

type TagType = SFCWithInstall<typeof Tag>;

export { tagProps } from './props';
export type { TagProps } from './props';
export const FTag = withInstall<TagType>(Tag as TagType);

export default FTag;
