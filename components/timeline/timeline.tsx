import {
    type CSSProperties,
    type VNode,
    type VNodeChild,
    computed,
    defineComponent,
} from 'vue';
import { useTheme } from '../_theme/useTheme';
import { timelineProps } from './props';
import { COMPONENT_NAME, prefixCls } from './const';
import {
    calcDescPosition,
    calcTitlePosition,
    cls,
    getTitleOppositePosition,
} from './utils';
import { useCustomIcons } from './useCustomIcons';
import Icon from './icon';
import type {
    TimelineInnerProps as Props,
    TimelineSlots as Slots,
    TimelineNode,
    TimelineUnboxSlots as UnboxSlots,
} from './props';

/** 渲染标题、辅助描述 */
const renderNodeContent = ({
    title,
    titlePosition,
    descPosition,
    desc,
    titleClass,
    descClass,
    appendantStyle,
}: Pick<TimelineNode, 'title' | 'titlePosition'> &
Pick<Props, 'descPosition' | 'titleClass' | 'descClass'> & {
        desc?: VNodeChild;
        appendantStyle?: CSSProperties;
    }): VNode => {
    const titleElement = (
        <div
            class={[
                cls('item-title'),
                cls(`item-title-layout-${titlePosition}`),
                titleClass,
            ]}
        >
            {title}
        </div>
    );
    const descElement = desc ? (
        <div
            class={[
                cls('item-desc'),
                cls(`item-desc-layout-${descPosition}`),
                descClass,
            ]}
        >
            {desc}
        </div>
    ) : undefined;

    // 标题、辅助描述同侧
    if (descPosition !== 'opposite') {
        return (
            <div
                class={[
                    cls('item-content-wrapper'),
                    cls(`item-content-wrapper-${titlePosition}`),
                ]}
                style={appendantStyle}
            >
                {titleElement}
                {descElement}
            </div>
        );
    }

    // 标题、辅助描述分侧
    return (
        <>
            <div
                class={[
                    cls('item-content-wrapper'),
                    cls(`item-content-wrapper-${titlePosition}`),
                ]}
                style={appendantStyle}
            >
                {titleElement}
            </div>
            {descElement && (
                <div
                    class={[
                        cls('item-content-wrapper'),
                        cls(
                            `item-content-wrapper-${getTitleOppositePosition(
                                titlePosition,
                            )}`,
                        ),
                    ]}
                    style={appendantStyle}
                >
                    {descElement}
                </div>
            )}
        </>
    );
};

const renderNode = (nodeProps: {
    node: TimelineNode;
    index: number;
    props: Props;
    slots: UnboxSlots;
    nodeAppendantStyleMap: ReturnType<
        typeof useCustomIcons
    >['nodeAppendantStyleMap'];
}): VNode => {
    const { node, index, props, slots, nodeAppendantStyleMap } = nodeProps;
    const { direction, titlePosition, descPosition, titleClass, descClass } =
        props;
    const { title, desc, icon } = node;
    const calculatedTitlePosition = calcTitlePosition(
        index,
        titlePosition,
        node.titlePosition,
    );

    const calculatedDescPosition = calcDescPosition(direction, descPosition);

    let descContent: VNodeChild;
    // prop 的渲染函数优先级高于插槽
    if (slots.desc) {
        descContent = slots.desc({ index });
    } else if (typeof desc === 'function') {
        descContent = desc({ index });
    } else {
        descContent = desc;
    }

    const appendantStyle = nodeAppendantStyleMap.value.get(index);

    return (
        <li
            class={[cls('item'), cls(`item-layout-${calculatedTitlePosition}`)]}
            key={index}
        >
            <div
                class={[
                    cls('item-tail'),
                    index === props.data.length - 1 && cls('item-tail-last'),
                ]}
                style={appendantStyle?.tail}
            />
            {renderNodeContent({
                title,
                titleClass,
                descClass,
                titlePosition: calculatedTitlePosition,
                descPosition: calculatedDescPosition,
                desc: descContent,
                appendantStyle: appendantStyle?.content,
            })}
            <Icon
                key={index}
                index={index}
                icon={icon}
                slotRender={slots.icon}
            />
        </li>
    );
};

export default defineComponent({
    name: COMPONENT_NAME,
    props: timelineProps,
    slots: Object as Slots,
    setup: (props: Props, { slots }) => {
        useTheme();

        const { nodeAppendantStyleMap } = useCustomIcons(
            props.direction,
            props.data,
        );

        const classList = computed(() => [
            prefixCls,
            cls(`direction-${props.direction}`),
            cls(`layout-${props.titlePosition}`),
            cls(`desc-${props.descPosition}`),
        ]);

        return () => (
            <ul class={classList.value}>
                {props.data.map((node, index) =>
                    renderNode({
                        node,
                        index,
                        props,
                        slots,
                        nodeAppendantStyleMap,
                    }),
                )}
            </ul>
        );
    },
});
