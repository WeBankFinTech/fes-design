import {
    CSSProperties,
    InjectionKey,
    Ref,
    computed,
    inject,
    onUnmounted,
    provide,
    reactive,
    ref,
    watch,
} from 'vue';
import useResize from '../_util/use/useResize';
import {
    COMPONENT_NAME,
    ICON_DEFAULT_SIDE_LENGTH,
    ICON_PADDING,
} from './const';
import {
    calcDimensionProp,
    calcInlineStartProp,
    calcLengthProp,
} from './utils';
import type { TimelineInnerProps as Props } from './props';

type NodeIndex = number;

type InjectValue = {
    registerIcon: (index: NodeIndex) => void;
    updateIcon: (index: NodeIndex, rect: DOMRect) => void;
    removeRegistration: (index: NodeIndex) => void;
};

const CUSTOM_ICONS_PROVIDE_KEY: InjectionKey<InjectValue> = Symbol(
    `${COMPONENT_NAME}CustomIconsProvideKey`,
);

export const useCustomIconRegister = (
    nodeIndex: number,
    isIconCustom: Ref<boolean>,
) => {
    const iconRef = ref<HTMLDivElement | null>(null);

    const { registerIcon, updateIcon, removeRegistration } = inject(
        CUSTOM_ICONS_PROVIDE_KEY,
    );

    useResize(iconRef, (entries) => {
        if (!isIconCustom.value) return;
        const iconRect = entries[0].contentRect;
        updateIcon(nodeIndex, iconRect);
    });

    watch(isIconCustom, (isCustom) => {
        if (!isCustom) {
            removeRegistration(nodeIndex);
            return;
        }
        registerIcon(nodeIndex);
    });

    onUnmounted(() => removeRegistration(nodeIndex));

    return { iconRef };
};

// 保证在存在自定义的轴点图标时，轴线的长度能满足与图标有 padding
export const useCustomIcons = (
    axisDirection: Props['direction'],
    nodes: Props['data'],
) => {
    const customIconRectMap = reactive(new Map<NodeIndex, DOMRect>());

    const registerIcon: InjectValue['registerIcon'] = (nodeIndex) => {
        customIconRectMap.set(nodeIndex, undefined);
    };

    const updateIcon: InjectValue['updateIcon'] = (nodeIndex, iconRect) => {
        customIconRectMap.set(nodeIndex, iconRect);
    };

    const removeRegistration: InjectValue['removeRegistration'] = (
        nodeIndex,
    ) => {
        customIconRectMap.delete(nodeIndex);
    };

    provide(CUSTOM_ICONS_PROVIDE_KEY, {
        registerIcon,
        updateIcon,
        removeRegistration,
    });

    // 当前 node 或下一 node 的轴点图标为自定义时，当前 node 就需要调整样式
    const nodeNeedAdjustIndexes = computed(() => {
        const customIconIndexes = Array.from(customIconRectMap.keys());

        return nodes.reduce((result, _, currentIndex) => {
            if (customIconIndexes.includes(currentIndex))
                return [...result, currentIndex];
            if (customIconIndexes.includes(currentIndex + 1))
                return [...result, currentIndex];

            return result;
        }, [] as number[]);
    });

    const nodeAppendantStyleMap = computed(() => {
        const styleMap = new Map<
            NodeIndex,
            { tail: CSSProperties; content: CSSProperties }
        >();

        nodeNeedAdjustIndexes.value.forEach((nodeIndex) => {
            const currentIconRect = customIconRectMap.get(nodeIndex);
            const nextIconRect = customIconRectMap.get(nodeIndex + 1);

            const dimension = calcDimensionProp(axisDirection);
            const inlineStartProp = calcInlineStartProp(axisDirection);
            const lengthProp = calcLengthProp(axisDirection);

            const currentIconLength =
                currentIconRect?.[dimension] ?? ICON_DEFAULT_SIDE_LENGTH;
            const nextIconLength =
                nextIconRect?.[dimension] ?? ICON_DEFAULT_SIDE_LENGTH;

            let contentStyle: CSSProperties = {};
            if (axisDirection !== 'column' && currentIconRect) {
                // 纵向内容不需要根据轴点图标的边长调整位置，只根据默认行高进行偏移
                // 当前 node 不存在 customIcon 时，也不需要对 node 的标题、辅助说明进行额外的偏移
                contentStyle = {
                    [inlineStartProp]: `calc(0px - ${currentIconLength}px / 2)`,
                };
            }

            styleMap.set(nodeIndex, {
                content: contentStyle,
                tail: {
                    [inlineStartProp]: `calc(${currentIconLength}px / 2 + ${ICON_PADDING}px)`,
                    [lengthProp]: `calc(100% - ${currentIconLength}px / 2 - ${nextIconLength}px / 2 - ${ICON_PADDING}px * 2)`,
                },
            });
        });

        return styleMap;
    });

    return { nodeAppendantStyleMap };
};
