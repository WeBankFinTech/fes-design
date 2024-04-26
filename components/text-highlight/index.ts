import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import TextHighlight from './text-highlight';

export { textHighlightProps } from './props';
export type { TextHighlightProps } from './props';

type TextHighlightType = SFCWithInstall<typeof TextHighlight>;
export const FTextHighlight = withInstall<TextHighlightType>(
    TextHighlight as TextHighlightType,
);

export default FTextHighlight;
