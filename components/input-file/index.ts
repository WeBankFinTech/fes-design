import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import InputFile from './inputFile';
import InputFileDragger from './inputFileDragger';

export { inputFileProps, type InputFileProps } from './props';

type InputFileType = SFCWithInstall<typeof InputFile>;
export const FInputFile = withInstall<InputFileType>(
    InputFile as InputFileType,
);

export { inputFileDraggerProps, type InputFileDraggerProps } from './props';
type InputFileDraggerType = SFCWithInstall<typeof InputFileDragger>;
export const FInputFileDragger = withInstall<InputFileDraggerType>(
    InputFileDragger as InputFileDraggerType,
);

export default FInputFile;
