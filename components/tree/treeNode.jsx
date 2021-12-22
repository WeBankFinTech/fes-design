import { defineComponent, computed, ref } from 'vue';
import { isUndefined } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import CaretDownOutlined from '../icon/CaretDownOutlined';
import Checkbox from '../checkbox';
import { COMPONENT_NAME } from './const';
import useTreeNode from './useTreeNode';

const prefixCls = getPrefixCls('tree-node');

export default defineComponent({
    name: COMPONENT_NAME.TREE_NODE,
    props: {
        value: {
            type: [String, Number],
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
        node: {
            type: Object,
        },
        handleData: Function,
    },
    setup(props, { slots }) {
        const {
            root,
            isExpanded,
            isSelected,
            isChecked,
            isIndeterminate,
            isChildrenInline,
        } = useTreeNode(props);

        const disabled = computed(() =>
            isUndefined(props.disabled) ? root.props.disabled : props.disabled,
        );
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
            ]
                .filter(Boolean)
                .join(' '),
        );

        let isLoaded = false;
        const isLoading = ref(false);
        const handleClickSwitcher = async (event) => {
            if (
                !isLoaded &&
                root.props.loadData &&
                (!props.node.children || props.node.children.length === 0)
            ) {
                isLoading.value = true;
                try {
                    const children = await root.props.loadData(
                        props.node.origin,
                    );
                    props.node.children = props.handleData(
                        children,
                        props.node.indexPath,
                        props.node.level + 1,
                    );
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
        const handleClickContent = (event) => {
            if (disabled.value) return;
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
        };
        const handleClickCheckbox = (event) => {
            if (disabled.value) return;
            if (checkable.value) {
                return root.checkNode(props.value, event);
            }
            if (selectable.value) {
                return root.selectNode(props.value, event);
            }
        };
        const handleStopClickPrefix = (event) => {
            event.stopPropagation();
        };
        const renderIndent = (children) => {
            const arr = [];
            let i = 1 + (children ? -1 : 0);
            while (i < props.level) {
                arr.push(<span class={`${prefixCls}-indent`} />);
                i++;
            }
            return arr;
        };
        const renderSwitcher = (children) => {
            if (props.isLeaf || children) {
                return <span class={`${prefixCls}-switcher`} />;
            }
            return (
                <span
                    class={`${prefixCls}-switcher`}
                    onClick={handleClickSwitcher}
                >
                    <LoadingOutlined v-show={isLoading.value} />
                    <CaretDownOutlined
                        v-show={!isLoading.value}
                        class={`${prefixCls}-switcher-icon ${
                            isExpanded.value ? 'is-expanded' : ''
                        }`}
                    />
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
                            disabled={props.disabled || props.checkboxDisabled}
                        />
                    </span>
                );
            }
            return null;
        };
        const renderChildrenIndent = () => {
            if (isChildrenInline.value) {
                return (
                    <>
                        {renderIndent(true)}
                        {renderSwitcher(true)}
                    </>
                );
            }
            return null;
        };
        const renderChildren = () => {
            if (slots.default && isExpanded.value) {
                return (
                    <div class={`${prefixCls}-children-wrapper`}>
                        {renderChildrenIndent()}
                        <div
                            class={`${prefixCls}-children ${
                                isChildrenInline.value ? 'is-inline' : ''
                            }`}
                        >
                            {slots.default?.()}
                        </div>
                    </div>
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
            <div class={classList.value} data-value={props.value}>
                <div class={`${prefixCls}-content-wrapper`}>
                    {renderIndent()}
                    {renderSwitcher()}
                    {renderCheckbox()}
                    <span
                        class={`${prefixCls}-content`}
                        onClick={handleClickContent}
                    >
                        {renderPrefix()}
                        <span class={`${prefixCls}-content-label`}>
                            {props.label}
                        </span>
                        {renderSuffix()}
                    </span>
                </div>
                {renderChildren()}
            </div>
        );
    },
});
