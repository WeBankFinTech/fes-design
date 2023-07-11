import { withInstall } from '../_util/withInstall';
import Image from './image.vue';
import PreviewGroup from './preview-group';

import type { SFCWithInstall } from '../_util/interface';

type ImageType = SFCWithInstall<typeof Image>;
type PreviewGroupType = SFCWithInstall<typeof PreviewGroup>;

export { imageProps } from './image.vue';
export type { ImageProps } from './image.vue';
export const FImage = withInstall<ImageType>(Image as ImageType);

export { previewGroupProps } from './preview-group';
export type { PreviewGroupProps } from './preview-group';
export const FPreviewGroup = withInstall<PreviewGroupType>(
    PreviewGroup as PreviewGroupType,
);

export default FImage;
