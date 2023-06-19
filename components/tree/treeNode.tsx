import {
    defineComponent,
    computed,
    ref,
    ExtractPropTypes,
    PropType,
    CSSProperties,
} from 'vue';
import { isUndefined } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import CaretDownOutlined from '../icon/CaretDownOutlined';
import LoadingOutlined from '../icon/LoadingOutlined';
import Checkbox from '../checkbox';
import FEllipsis from '../ellipsis';
import { COMPONENT_NAME, INDENT } from './const';
import useTreeNode from './useTreeNode';

const prefixCls = getPrefixCls('tree-node');

const treeNodeProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    label: {
        type: String,
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
} as const;

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
                !isLoaded &&
                root.props.loadData &&
                (!node.children || node.children.length === 0)
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
            if (disabled.value) return;
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
            if (disabled.value) return;
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleStopClickPrefix = (event: Event) => {
            event.stopPropagation();
        };
        const renderDrag = () => {
            const dragOverInfo = root.dragOverInfo.value;
            if (dragOverInfo?.node.value === props.value) {
                const style: CSSProperties = {};
                if (dragOverInfo?.position === 'before') {
                    style['top'] = '2px';
                } else if (dragOverInfo?.position === 'after') {
                    style['bottom'] = '2px';
                }
                style['left'] = `${props.level * INDENT + 9}px`;
                return <div class={`${prefixCls}-drag-over`} style={style} />;
            }
            return null;
        };
        const renderSwitcher = () => {
            if (props.isLeaf) {
                return <span class={`${prefixCls}-switcher`} />;
            }
            return (
                <span
                    class={`${prefixCls}-switcher`}
                    onClick={handleClickSwitcher}
                >
                    {isLoading.value ? (
                        <LoadingOutlined />
                    ) : (
                        <CaretDownOutlined
                            class={`${prefixCls}-switcher-icon ${
                                isExpanded.value ? 'is-expanded' : ''
                            }`}
                        />
                    )}
                </span>
            );
        };
        const renderCheckbox = () => {
            if (root.props.checkable) {
                return (
                    <span class={`${prefixCls}-checkbox`}>
                        <Checkbox
                            indeterminate={isIndeterminate.value}
                            modelValue={isChecked.value}
                            onClick={handleClickCheckbox}
                            disabled={props.disabled}
                        />
                    </span>
                );
            }
            return null;
        };
        const renderPrefix = () => {
            if (!slots.prefix) return null;
            return (
                <span
                    class={`${prefixCls}-content-prefix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.prefix?.()}
                </span>
            );
        };
        const renderSuffix = () => {
            if (!slots.suffix) return null;
            return (
                <span
                    class={`${prefixCls}-content-suffix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.suffix?.()}
                </span>
            );
        };
        return () => (
            <div
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
                {renderDrag()}
                {renderSwitcher()}
                {renderCheckbox()}
                <span
                    class={`${prefixCls}-content`}
                    onClick={handleClickContent}
                >
                    {renderPrefix()}
                    <FEllipsis
                        class={`${prefixCls}-content-label`}
                        content={props.label}
                    />
                    {renderSuffix()}
                </span>
            </div>
        );
    },
});
