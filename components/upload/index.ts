import { withInstall } from '../_util/withInstall';
import Upload from './upload';

import type { SFCWithInstall } from '../_util/interface';

type UploadType = SFCWithInstall<typeof Upload>;
export const FUpload = withInstall<UploadType>(Upload as UploadType);

export default FUpload;
