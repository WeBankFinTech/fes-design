import type {
    CSSProperties,
    ComponentObjectPropsOptions,
    DefineComponent,
    PropType,
} from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export type Align =
    | 'stretch'
    | 'baseline'
    | 'start'
    | 'end'
    | 'center'
    | 'flex-end'
    | 'flex-start';

export type Justify =
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between';

export type Size = 'xsmall' | 'small' | 'middle' | 'large';

export const spaceProps = {
    align: {
        type: String as PropType<Align>,
        default: 'start',
    },
    justify: {
        type: String as PropType<Justify>,
        default: 'start',
    },
    inline: Boolean,
    vertical: Boolean, // 是否垂直布局
    size: {
        type: [String, Number, Array] as PropType<
            Size | number | [number, number]
        >,
        default: 'small',
    },
    itemStyle: [String, Object] as PropType<string | CSSProperties>,
    wrap: {
        type: Boolean,
        default: true,
    },
} as const satisfies ComponentObjectPropsOptions;

export type SpaceProps = ExtractPublicPropTypes<typeof spaceProps>;

export type SpaceInnerProps = Parameters<
    DefineComponent<typeof spaceProps>['setup']
>[0];
