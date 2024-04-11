import { withInstall } from '../_util/withInstall';
import TextHighlight from './text-highlight';
import type { SFCWithInstall } from '../_util/interface';

export { textHighlightProps } from './props';
export type { TextHighlightProps } from './props';

type TextHighlightType = SFCWithInstall<typeof TextHighlight>;
export const FTextHighlight = withInstall<TextHighlightType>(
    TextHighlight as TextHighlightType,
);

export default FTextHighlight;
