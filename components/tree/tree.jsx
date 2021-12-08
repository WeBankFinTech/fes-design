import {
    defineComponent, computed, provide, onMounted, ref, watch,
} from 'vue';
import {
    isFunction, isString, isNil, cloneDeep,
} from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import TreeNode from './treeNode';
import { PROVIDE_KEY, COMPONENT_NAME } from './const';
import useFilter from './useFilter';

const prefixCls = getPrefixCls('tree');

export default defineComponent({
    name: COMPONENT_NAME.TREE,
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
            required: true,
        },
        defaultExpandAll: {
            type: Boolean,
            default: false,
        },
        expandedKeys: {
            type: Array,
            default() {
                return [];
            },
        },
        checkedKeys: {
            type: Array,
            default() {
                return [];
            },
        },
        accordion: {
            type: Boolean,
            default: false,
        },
        checkable: {
            type: Boolean,
            default: false,
        },
        checkStrictly: {
            type: Boolean,
            default: false,
        },
        selectable: {
            type: Boolean,
            default: true,
        },
        selectedKeys: {
            type: Array,
            default() {
                return [];
            },
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        childrenField: {
            type: String,
            default: 'children',
        },
        valueField: {
            type: String,
            default: 'value',
        },
        labelField: {
            type: String,
            default: 'label',
        },
        remote: {
            type: Boolean,
            default: false,
        },
        loadData: {
            type: Function,
            default: null,
        },
        filterMethod: {
            type: Function,
            default: null,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'update:expandedKeys',
        'update:checkedKeys',
        'update:selectedKeys',
        'check',
        'expand',
        'load',
        'select',
    ],
    setup(props, { emit, expose }) {
        const nodeList = {};
        const addNode = (value, item) => {
            if (!nodeList[value]) {
                nodeList[value] = item;
            }
        };
        const currentData = ref([]);
        const transformNode = (item, indexPath, level) => {
            const copy = { ...item };
            const value = copy[props.valueField];
            const label = copy[props.labelField];
            const children = copy[props.childrenField];
            const hasChildren = Array.isArray(children) && children.length;
            let isLeaf;
            if (!isNil(copy.isLeaf)) {
                isLeaf = copy.isLeaf;
            } else if (hasChildren) {
                isLeaf = false;
            } else if (props.remote) {
                isLeaf = false;
            } else {
                isLeaf = true;
            }
            copy.origin = item;
            copy.value = value;
            copy.label = label;
            copy.isLeaf = isLeaf;
            // 处理indexPath
            copy.indexPath = [...indexPath, value];
            copy.level = level;
            copy.hasChildren = hasChildren;
            // 扁平化
            addNode(value, copy);
            return copy;
        };
        const handleData = (arr, indexPath = [], level = 1) => arr.map((item) => {
            const copy = transformNode(item, indexPath, level);
            if (copy.hasChildren) {
                copy.children = handleData(copy.children, copy.indexPath, level + 1);
            }
            return copy;
        });

        watch(() => props.data, () => {
            currentData.value = handleData(props.data);
        }, {
            immediate: true,
            deep: true,
        });

        const [currentExpandedKeys, updateExpandedKeys] = useNormalModel(
            props,
            emit,
            { prop: 'expandedKeys', isEqual: true },
        );
        const [currentCheckedKeys, updateCheckedKeys] = useNormalModel(
            props,
            emit,
            { prop: 'checkedKeys', isEqual: true },
        );
        const [currentSelectedKeys, updateSelectedKeys] = useNormalModel(
            props,
            emit,
            { prop: 'selectedKeys', isEqual: true },
        );
        const { filter, hiddenKeys, filteredExpandedKeys } = useFilter(props);
        onMounted(() => {
            if (props.defaultExpandAll && currentExpandedKeys.value.length === 0) {
                updateExpandedKeys(Object.values(nodeList).map(item => item.value));
            }
        });
        const selectNode = (val, event) => {
            const node = nodeList[val];
            const values = cloneDeep(currentSelectedKeys.value);
            if (!props.selectable) {
                return;
            }
            const index = values.indexOf(val);
            if (props.multiple) {
                if (index !== -1) {
                    values.splice(index, 1);
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                values.splice(index, 1);
            } else {
                values[0] = val;
            }
            updateSelectedKeys(values);
            event && emit('select', {
                selectedKeys: values, event, node, selected: values.includes(val),
            });
        };
        const expandNode = (val, event) => {
            const node = nodeList[val];
            let values = cloneDeep(currentExpandedKeys.value);
            const index = values.indexOf(val);
            // 已经展开
            if (index !== -1) {
                values.splice(index, 1);
            } else {
                if (props.accordion) {
                    values = values.filter(item => node.indexPath.includes(item));
                }
                values.push(val);
            }
            updateExpandedKeys(values);
            event && emit('expand', {
                expandedKeys: values, event, node, expanded: values.includes(val),
            });
        };
        function handleChildren(arr, children, isAdd) {
            children.forEach((child) => {
                const index = arr.indexOf(child.value);
                if (!isAdd) {
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                } else if (index === -1) {
                    arr.push(child.value);
                }
                if (child.children) {
                    handleChildren(arr, child.children, isAdd);
                }
            });
        }
        function handleParent(arr, indexPath, isAdd) {
            let len = indexPath.length - 2;
            for (len; len >= 0; len--) {
                const parent = nodeList[indexPath[len]];
                const index = arr.indexOf(parent.value);
                if (!isAdd) {
                    if (index !== -1) {
                        arr.splice(index, 1);
                    }
                } else if (index === -1) {
                    if (
                        parent.children.every(item => arr.includes(item.value))
                    ) {
                        arr.push(parent.value);
                    }
                }
            }
        }
        const checkNode = (val, event) => {
            const node = nodeList[val];
            const { isLeaf, children, indexPath } = node;
            const values = cloneDeep(currentCheckedKeys.value);
            const index = values.indexOf(val);
            if (props.checkStrictly) {
                if (index !== -1) {
                    values.splice(index, 1);
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                values.splice(index, 1);
                handleParent(values, indexPath, false);
                if (!isLeaf) {
                    handleChildren(values, children, false);
                }
            } else {
                values.push(val);
                handleParent(values, indexPath, true);
                if (!isLeaf) {
                    handleChildren(values, children, true);
                }
            }
            updateCheckedKeys(values);
            event && emit('check', {
                checkedKeys: values, event, node, checked: values.includes(val),
            });
        };

        if (expose) {
            expose({
                selectNode,
                expandNode,
                checkNode,
                filter,
            });
        }

        provide(PROVIDE_KEY, {
            props,
            selectNode,
            currentSelectedKeys,
            expandNode,
            currentExpandedKeys,
            checkNode,
            currentCheckedKeys,
            filteredExpandedKeys,
        });


        const classList = computed(() => [prefixCls].filter(Boolean).join(' '));
        const renderChildren = arr => arr.map((item) => {
            const itemSlots = {};
            if (isFunction(item.prefix)) {
                itemSlots.prefix = item.prefix;
            }
            if (isString(item.prefix)) {
                itemSlots.prefix = () => item.prefix;
            }
            if (isFunction(item.suffix)) {
                itemSlots.suffix = item.suffix;
            }
            if (isString(item.suffix)) {
                itemSlots.suffix = () => item.suffix;
            }
            const hasChildren = Array.isArray(item.children) && item.children.length;
            return (
                <TreeNode
                    v-show={!hiddenKeys.includes(item.value)}
                    node={item}
                    level={item.level}
                    value={item.value}
                    label={item.label}
                    disabled={item.disabled}
                    checkboxDisabled={item.checkboxDisabled}
                    isLeaf={item.isLeaf}
                    handleData={handleData}
                    v-slots={itemSlots}
                >
                    {hasChildren
                        ? renderChildren(item.children)
                        : null}
                </TreeNode>
            );
        });
        const renderTreeNode = () => renderChildren(currentData.value);
        return () => (
            <div className={classList.value} role="tree">
                {renderTreeNode()}
            </div>
        );
    },
});
