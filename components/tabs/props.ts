import type { ComponentObjectPropsOptions, PropType, VNode } from 'vue';
import type {
    Value,
    Position,
    TabCloseMode,
    TabDisplayDirective,
} from './interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

type TabType = 'line' | 'card';

type TabPaneProps = TabProps & {
    render?: (props: TabProps) => VNode[];
    renderTab?: (props: TabProps) => VNode[];
};

// ----- Tabs -----

export const tabsProps = {
    modelValue: [String, Number] as PropType<Value>,
    position: {
        type: String as PropType<Position>,
        default: 'top' satisfies Position,
    },
    type: {
        type: String as PropType<TabType>,
        default: 'line' satisfies TabType,
    },
    closable: {
        type: Boolean,
        default: false,
    },
    closeMode: {
        type: String as PropType<TabCloseMode>,
        default: 'visible' satisfies TabCloseMode,
    },
    addable: {
        type: Boolean,
        default: false,
    },
    transition: {
        type: [String, Boolean] as PropType<string | boolean>,
        default: true,
    },
    panes: {
        type: Array as PropType<TabPaneProps>,
        default: (): TabPaneProps[] => [],
    },
} as const satisfies ComponentObjectPropsOptions;

export type TabsProps = ExtractPublicPropTypes<typeof tabsProps>;

// ----- Tab -----

export const tabProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    name: [String, Number] as PropType<string | number>,
    disabled: Boolean,
    closable: {
        type: Boolean as PropType<boolean | undefined>,
        default: null as null,
    },
    displayDirective: {
        type: String as PropType<TabDisplayDirective>,
        default: 'if' satisfies TabDisplayDirective,
    },
} as const satisfies ComponentObjectPropsOptions;

export type TabProps = ExtractPublicPropTypes<typeof tabProps>;
