import { SlotsType, VNode, computed, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { isValidElementNode } from '../_util/vnode';
import { TimelineNode, timelineProps } from './props';
import {
    COMPONENT_NAME,
    ComponentProps as Props,
    ComponentSlots as Slots,
    ComponentUnboxSlots as UnboxSlots,
    cls,
    prefixCls,
    warn,
} from './const';

const getTitleOppositePosition = (
    position: TimelineNode['titlePosition'],
): TimelineNode['titlePosition'] => {
    return position === 'start' ? 'end' : 'start';
};

const isInValidRenderResult = (result: VNode | VNode[]): boolean => {
    if (Array.isArray(result)) {
        return result.some((node) => !isValidElementNode(node));
    }
    return !isValidElementNode(result);
};

const renderIcon = (
    index: number,
    icon?: TimelineNode['icon'],
    slotRender?: UnboxSlots['icon'],
): VNode => {
    let customIcon: VNode[] | VNode | undefined;
    // prop 的渲染函数优先级高于插槽
    if (slotRender) {
        customIcon = slotRender({ index });
    } else if (typeof icon === 'function') {
        customIcon = icon({ index });
    }

    if (customIcon && isInValidRenderResult(customIcon)) {
        customIcon = undefined;
    }

    const isCustomIconColor = typeof icon === 'string' && icon.startsWith('#');

    return customIcon ? (
        // 自定义图标
        <div class={[cls('item-icon'), cls('item-icon-custom')]}>
            {customIcon}
        </div>
    ) : isCustomIconColor ? (
        // 自定义颜色
        <div
            class={cls('item-icon')}
            style={{ color: icon, borderColor: icon }}
        />
    ) : (
        // 预设颜色
        <div class={[cls('item-icon'), cls(`item-icon-${icon ?? 'info'}`)]} />
    );
};

/** 渲染标题、辅助描述 */
const renderNodeContent = (
    title: TimelineNode['title'],
    titlePosition: TimelineNode['titlePosition'],
    descPosition: Props['descPosition'],
    desc?: VNode[] | VNode,
    titleClassName?: Props['titleClassName'],
    descClassName?: Props['descClassName'],
): VNode => {
    const titleElement = (
        <div
            class={[
                cls('item-title'),
                cls(`item-title-layout-${titlePosition}`),
                titleClassName,
            ]}
        >
            {title}
        </div>
    );
    const descElement = (
        <div
            class={[
                cls('item-desc'),
                cls(`item-desc-layout-${descPosition}`),
                descClassName,
            ]}
        >
            {desc}
        </div>
    );

    // 标题、辅助描述同侧
    if (descPosition !== 'opposite') {
        return (
            <div
                class={[
                    cls('item-content-wrapper'),
                    cls(`item-content-wrapper-${titlePosition}`),
                ]}
            >
                {titleElement}
                {desc && descElement}
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
            >
                {titleElement}
            </div>
            {desc && (
                <div
                    class={[
                        cls('item-content-wrapper'),
                        cls(
                            `item-content-wrapper-${getTitleOppositePosition(
                                titlePosition,
                            )}`,
                        ),
                    ]}
                >
                    {descElement}
                </div>
            )}
        </>
    );
};

const calcTitlePosition = (
    index: number,
    propPosition: Props['titlePosition'],
    nodePosition: TimelineNode['titlePosition'],
): TimelineNode['titlePosition'] => {
    // 组件设置的布局方式优先级最高
    if (propPosition !== 'alternate') {
        return propPosition;
    }
    // 只有设置了交叉布局，node 自定义的位置才会生效
    if (nodePosition) {
        return nodePosition;
    }
    // 交叉布局且 node 未自定义时，交替排列
    return index % 2 === 0 ? 'start' : 'end';
};

const calcDescPosition = (
    direction: Props['direction'],
    descPosition: Props['descPosition'],
): Props['descPosition'] => {
    if (
        (direction === 'row' || direction === 'row-reverse') &&
        descPosition === 'inline'
    ) {
        warn('横向时间轴中不支持标题和辅助描述同行');
        return 'under';
    }
    return descPosition;
};

const renderNodes = (
    {
        direction,
        titlePosition,
        descPosition,
        titleClassName,
        descClassName,
        data: nodes,
    }: Props,
    slots: UnboxSlots,
): VNode[] => {
    return nodes.map((node, index) => {
        const { title, desc, icon } = node;
        const calculatedTitlePosition = calcTitlePosition(
            index,
            titlePosition,
            node.titlePosition,
        );

        const calculatedDescPosition = calcDescPosition(
            direction,
            descPosition,
        );

        let descContent: VNode[] | VNode | undefined;
        // prop 的渲染函数优先级高于插槽
        if (slots.desc) {
            descContent = slots.desc({ index });
        } else if (typeof desc === 'function') {
            descContent = desc({ index });
        } else {
            descContent = <>{desc}</>;
        }

        return (
            <li
                class={[
                    cls('item'),
                    cls(`item-layout-${calculatedTitlePosition}`),
                ]}
            >
                <div
                    class={[
                        cls('item-tail'),
                        index === nodes.length - 1 && cls('item-tail-last'),
                    ]}
                />
                {renderNodeContent(
                    title,
                    calculatedTitlePosition,
                    calculatedDescPosition,
                    descContent,
                    titleClassName,
                    descClassName,
                )}
                {renderIcon(index, icon, slots.icon)}
            </li>
        );
    });
};

export default defineComponent({
    name: COMPONENT_NAME,
    props: timelineProps,
    slots: Object as SlotsType<Slots>,
    setup: (props: Props, { slots }) => {
        useTheme();

        const classList = computed(() => [
            prefixCls,
            cls(`direction-${props.direction}`),
            cls(`layout-${props.titlePosition}`),
            cls(`desc-${props.descPosition}`),
        ]);

        return () => (
            <ul class={classList.value}>{renderNodes(props, slots)}</ul>
        );
    },
});
