import {
    defineComponent, computed, ref,
} from 'vue';
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
            default: false,
        },
        checkboxDisabled: {
            type: Boolean,
            default: false,
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

        const classList = computed(() => [
            prefixCls,
            props.disabled && 'is-disabled',
            isSelected.value && 'is-selected',
        ]
            .filter(Boolean)
            .join(' '));

        let isLoaded = false;
        const isLoading = ref(false);
        const handleClickSwitcher = async (event) => {
            if (
                !isLoaded
                && root.props.loadData
                && (!props.node.children || props.node.children.length === 0)
            ) {
                isLoading.value = true;
                try {
                    const children = await root.props.loadData(props.node.origin);
                    props.node.children = props.handleData(children, props.node.indexPath, props.node.level + 1);
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
            if (props.disabled) return;
            root.selectNode(props.value, event);
        };
        const handleClickCheckbox = (event) => {
            if (props.disabled || props.checkboxDisabled) return;
            root.checkNode(props.value, event);
        };
        const handleStopClickPrefix = (event) => {
            event.stopPropagation();
        };
        const renderIndent = (children) => {
            const arr = [];
            let i = 1 + (children ? -1 : 0);
            while (i < props.level) {
                arr.push(<span className={`${prefixCls}-indent`} />);
                i++;
            }
            return arr;
        };
        const renderSwitcher = (children) => {
            if (props.isLeaf || children) { return <span className={`${prefixCls}-switcher`} />; }
            return (
                <span
                    className={`${prefixCls}-switcher`}
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
                    <span className={`${prefixCls}-checkbox`}>
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
                    <div className={`${prefixCls}-children-wrapper`}>
                        {renderChildrenIndent()}
                        <div
                            className={`${prefixCls}-children ${
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
                    className={`${prefixCls}-content-prefix`}
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
                    className={`${prefixCls}-content-suffix`}
                    onClick={handleStopClickPrefix}
                >
                    {slots.suffix?.()}
                </span>
            );
        };
        return () => (
            <div className={classList.value} data-value={props.value}>
                <div className={`${prefixCls}-content-wrapper`}>
                    {renderIndent()}
                    {renderSwitcher()}
                    {renderCheckbox()}
                    <span
                        className={`${prefixCls}-content`}
                        onClick={handleClickContent}
                    >
                        {renderPrefix()}
                        <span className={`${prefixCls}-content-label`}>
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
