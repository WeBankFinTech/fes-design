import getPrefixCls from '../_util/getPrefixCls';
import type { TimelineNode } from './props';

export const COMPONENT_NAME = 'FTimeline';

export const prefixCls = getPrefixCls('timeline');

export const ICON_DEFAULT_COLOR = 'info' satisfies TimelineNode['icon'];

// 轴点图标的内边距，与 index.less 中的 @icon-padding 一致
export const ICON_PADDING = 4;

// 轴点默认图标的边长，与 index.less 中的 @icon-side-length 一致
export const ICON_DEFAULT_SIDE_LENGTH = 8;
