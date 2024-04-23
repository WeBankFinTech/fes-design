import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import Text from './text';

type TextType = SFCWithInstall<typeof Text>;

export { textProps } from './props';
export type { TextProps } from './props';
export const FText = withInstall<TextType>(Text as TextType);

export default FText;
