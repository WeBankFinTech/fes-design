import { withInstall } from '../_util/withInstall';
import Image from './image.vue';
import PreviewGroup from './preview-group';

import type { SFCWithInstall } from '../_util/interface';

type ImageType = SFCWithInstall<typeof Image>;
type PreviewGroupType = SFCWithInstall<typeof PreviewGroup>;
export const FImage = withInstall<ImageType>(Image as ImageType);

export const FPreviewGroup = withInstall<PreviewGroupType>(
    PreviewGroup as PreviewGroupType,
);

export default FImage;
