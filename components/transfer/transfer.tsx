import {
    type SlotsType,
    computed,
    defineComponent,
    provide,
    type VNodeChild,
    type CSSProperties,
} from 'vue';
import { isFunction, isUndefined } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import { COMPONENT_NAME, TRANSFER_INJECT_KEY, TransferStyle } from './const';
import { transferProps } from './props';
import OneWayTransfer from './oneWayTransfer';
import TwoWayTransfer from './twoWayTransfer';
import { defaultFilter, isTree } from './utils';
import {
    type TransferOption,
    type TransferFilter,
    type TransferInjection,
} from './interface';

const Transfer = defineComponent({
    name: COMPONENT_NAME,
    props: transferProps,
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT],
    slots: Object as SlotsType<{
        label: { option: TransferOption };
    }>,
    setup: (props, { emit, slots }) => {
        useTheme();

        const [modelValue] = useNormalModel(props, emit);

        const filter = computed<TransferFilter>(() => {
            if (isFunction(props.filter)) {
                return props.filter;
            }
            return defaultFilter;
        });

        const renderLabel = (option: TransferOption): VNodeChild => {
            if (slots.label) {
                return slots.label({ option });
            }
            return option.label;
        };

        // 滚动部分的高度，决定是否开启虚拟滚动
        const scrollContentHeight = computed<number | null>(() => {
            if (isUndefined(props.height)) return null;
            let contentHeight =
                props.height -
                TransferStyle.PANEL_PADDING * 2 -
                TransferStyle.PANEL_BLOCK_GAP -
                TransferStyle.PANEL_HEADER_HEIGHT;

            if (props.filterable) {
                contentHeight =
                    contentHeight -
                    TransferStyle.PANEL_BLOCK_GAP -
                    TransferStyle.PANEL_FILTER_HEIGHT;
            }

            return contentHeight;
        });

        const rootStyle = computed<CSSProperties>(() => {
            return props.height ? { height: `${props.height}px` } : undefined;
        });

        const handleChange: TransferInjection['handleChange'] = (
            changeValue,
        ) => {
            emit(CHANGE_EVENT, changeValue);
        };

        provide(TRANSFER_INJECT_KEY, {
            modelValue,
            rootStyle,
            filter,
            renderLabel,
            handleChange,
            scrollContentHeight,
            rootProps: props,
        });

        return () => {
            if (!props.twoWay) {
                return <OneWayTransfer />;
            }

            if (isTree(props.options)) {
                console.warn(
                    `[${COMPONENT_NAME}]: 双向穿梭框不允许使用树形结构`,
                );
                return <OneWayTransfer />;
            }

            return <TwoWayTransfer />;
        };
    },
});

export default Transfer;
