import {
    type CSSProperties,
    type ComponentObjectPropsOptions,
    type ExtractPropTypes,
    type PropType,
    type VNodeChild,
    computed,
    defineComponent,
    ref,
} from 'vue';
import { isFunction, isUndefined } from 'lodash-es';
import { useElementHover } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import CaretDownOutlined from '../icon/CaretDownOutlined';
import LoadingOutlined from '../icon/LoadingOutlined';
import Checkbox from '../checkbox';
import FEllipsis from '../ellipsis';
import TextHightlight from '../text-highlight';
import { COMPONENT_NAME, INDENT } from './const';
import useTreeNode from './useTreeNode';
import type { TreeOption } from './interface';

const prefixCls = getPrefixCls('tree-node');

const treeNodeProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    label: {
        type: [String, Function] as PropType<string | ((node: TreeOption) => VNodeChild)>,
        required: true,
    },
    disabled: {
        type: Boolean,
    },
    selectable: {
        type: Boolean,
    },
    checkable: {
        type: Boolean,
    },
    isLeaf: {
        type: Boolean,
        default: false,
    },
    level: {
        type: Number,
        default: 0,
    },
    draggable: {
        type: Boolean,
        default: false,
    },
    noExpand: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>;

export default defineComponent({
    name: COMPONENT_NAME.TREE_NODE,
    props: treeNodeProps,
    setup(props, { slots }) {
        const {
            root,
            isExpanded,
            isSelected,
            isChecked,
            isIndeterminate,
            isInline,
            isFirst,
        } = useTreeNode(props);

        const disabled = computed(() => props.disabled);
        const selectable = computed(() =>
            isUndefined(props.selectable)
                ? root.props.selectable
                : props.selectable,
        );
        const checkable = computed(() =>
            isUndefined(props.checkable)
                ? root.props.checkable
                : props.checkable,
        );

        const classList = computed(() =>
            [
                prefixCls,
                disabled.value && 'is-disabled',
                isSelected.value && 'is-selected',
                isInline.value && 'is-inline',
                isFirst.value && 'is-inline-first',
                root.dragHighlightNode.value?.value === props.value
                && 'is-highlight',
            ].filter(Boolean),
        );

        const style = computed(() => {
            if (isInline.value && !isFirst.value) {
                return {};
            }
            return {
                paddingLeft: `${(props.level - 1) * INDENT}px`,
            };
        });

        let isLoaded = false;
        const isLoading = ref(false);
        const handleClickSwitcher = async (event?: Event) => {
            const node = root.nodeList.get(props.value);
            if (
                !isLoaded
                && root.props.loadData
                && (!node.children || node.children.length === 0)
            ) {
                isLoading.value = true;
                try {
                    await root.props.loadData(node.origin);
                    isLoaded = true;
                    root.expandNode(props.value, event);
                } catch (e) {
                    console.error(e);
                }
                isLoading.value = false;
            } else {
                root.expandNode(props.value, event);
            }
        };
        const handleClickContent = (event: Event) => {
            if (disabled.value) {
                return;
            }
            // 默认 select 行为
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
            // 再 check 行为
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
            // 再展开行为
            if (!props.isLeaf) {
                handleClickSwitcher(event);
            }
        };
        const handleClickCheckbox = (event: Event) => {
            if (disabled.value) {
                return;
            }
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleStopClickPrefix = (event: Event) => {
            event.stopPropagation();
        };
        const renderDragTag = () => {
            const dragOverInfo = root.dragOverInfo.value;
            if (!dragOverInfo) {
                return;
            }
            if (dragOverInfo.position === 'inside') {
                return;
            }
            if (dragOverInfo?.node.value === props.value) {
                const style: CSSProperties = {};
                style.left = `${props.level * INDENT + 9}px`;
                return (
                    <div
                        class={[
                            `${prefixCls}-drag-over`,
                            `is-${dragOverInfo?.position}`,
                        ]}
                        style={style}
                    />
                );
            }
            return null;
        };
        const renderSwitcher = () => {
            if (props.isLeaf) {
                const leafClass = [`${prefixCls}-switcher`];
                if (props.noExpand) {
                    leafClass.push('no-expand');
                }
                return <span class={leafClass} />;
            }

            const icon = isLoading.value
                ? <LoadingOutlined />
                : (
                        <CaretDownOutlined
                            class={[`${prefixCls}-switcher-icon`, isExpanded.value ? 'is-expanded' : '']}
                        />
                    );

            return (
                <span class={`${prefixCls}-switcher`} onClick={handleClickSwitcher}>
                    {icon}
                </span>
            );
        };
        const renderCheckbox = () => {
            if (!checkable.value) {
                return null;
            }
            return (
                <span class={`${prefixCls}-checkbox`}>
                    <Checkbox
                        indeterminate={isIndeterminate.value}
                        modelValue={isChecked.value}
                        onChange={handleClickCheckbox}
                        disabled={props.disabled}
                    />
                </span>
            );
        };

        const treeNodeElement = ref();

        const isHovered = useElementHover(treeNodeElement);
        const slotParams = computed(() => {
            return {
                isHovered: isHovered.value,
                value: props.value,
            };
        });

        const renderPrefix = () => {
            if (!slots.prefix) {
                return null;
            }
            return (
                <span
                    class={`${prefixCls}-content-prefix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.prefix?.(slotParams.value)}
                </span>
            );
        };
        const renderSuffix = () => {
            if (!slots.suffix) {
                return null;
            }
            return (
                <span
                    class={`${prefixCls}-content-suffix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.suffix?.(slotParams.value)}
                </span>
            );
        };

        const renderLabel = () => {
            const node = root.nodeList.get(props.value);
            if (isFunction(props.label)) {
                return (
                    <span class={`${prefixCls}-content-label`}>
                        {props.label(node)}
                    </span>
                );
            } else if (isFunction(root.slots.label)) {
                return (
                    <span class={`${prefixCls}-content-label`}>
                        {root.slots.label(node)}
                    </span>
                );
            }
            return (
                <FEllipsis
                    class={`${prefixCls}-content-label`}
                >
                    {root.props.filterTextHighlight && root.props.filterText
                        ? (
                                <TextHightlight strict searchValues={[root.props.filterText]}>
                                    {props.label}
                                </TextHightlight>
                            )
                        : props.label
                    }
                </FEllipsis>
            );
        };

        return () => (
            <div
                ref={treeNodeElement}
                class={classList.value}
                style={style.value}
                data-value={props.value}
                draggable={props.draggable}
                onDragstart={(event: DragEvent) => {
                    root.handleDragstart(props.value, event);
                }}
                onDragenter={(event: DragEvent) => {
                    root.handleDragenter(props.value, event);
                }}
                onDragover={(event: DragEvent) => {
                    root.handleDragover(props.value, event);
                }}
                onDragleave={(event: DragEvent) => {
                    root.handleDragleave(props.value, event);
                }}
                onDragend={(event: DragEvent) => {
                    root.handleDragend(props.value, event);
                }}
                onDrop={(event: DragEvent) => {
                    root.handleDrop(props.value, event);
                }}
            >
                {renderDragTag()}
                {renderSwitcher()}
                {renderCheckbox()}
                <span
                    class={`${prefixCls}-content`}
                    onClick={handleClickContent}
                >
                    {renderPrefix()}
                    {renderLabel()}
                    {renderSuffix()}
                </span>
            </div>
        );
    },
});
