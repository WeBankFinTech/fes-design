import { withInstall, withNoopInstall } from '../_util/withInstall';
import Upload from './upload';
import UploadDragger from './uploadDragger';

import type { SFCWithInstall } from '../_util/interface';

type UploadType = SFCWithInstall<typeof Upload>;
export const FUpload = withInstall<UploadType>(Upload as UploadType, {
    UploadDragger,
});

type UploadDraggerType = SFCWithInstall<typeof UploadDragger>;
export const FUploadDragger = withNoopInstall<UploadDraggerType>(
    UploadDragger as UploadDraggerType,
);

export default FUpload;
