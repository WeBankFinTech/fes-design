import { defineComponent, computed, provide, onMounted } from 'vue';
import { isFunction, isString, cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import TreeNode from './treeNode';
import { PROVIDE_KEY, COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import PROPS from './props';

const prefixCls = getPrefixCls('tree');

export default defineComponent({
    name: COMPONENT_NAME.TREE,
    props: {
        ...PROPS,
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
        useTheme();

        const { nodeList, currentData, handleData } = useData(props);

        const {
            currentExpandedKeys,
            updateExpandedKeys,
            currentCheckedKeys,
            updateCheckedKeys,
            currentSelectedKeys,
            updateSelectedKeys,
            filter,
            hiddenKeys,
            hasSelected,
            hasChecked,
            hasIndeterminate,
            hasExpanded,
        } = useState(props, { emit });

        onMounted(() => {
            if (
                props.defaultExpandAll &&
                currentExpandedKeys.value.length === 0
            ) {
                updateExpandedKeys(
                    Object.values(nodeList).map((item) => item.value),
                );
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
            emit('select', {
                selectedKeys: values,
                event,
                node,
                selected: values.includes(val),
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
                    values = values.filter((item) =>
                        node.indexPath.includes(item),
                    );
                }
                values.push(val);
            }
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: values.includes(val),
            });
        };

        function getCheckedKeys(arr) {
            return props.cascade
                ? arr.filter((key) => {
                      const node = nodeList[key];
                      if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                          return true;
                      }
                      if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                          return (
                              node.indexPath.filter((path) =>
                                  arr.includes(path),
                              ).length === 1
                          );
                      }
                      if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                          return node.isLeaf;
                      }
                      return true;
                  })
                : arr;
        }
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
                        parent.children.every((item) =>
                            arr.includes(item.value),
                        )
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
            if (!props.cascade) {
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
            emit('check', {
                checkedKeys: getCheckedKeys(values),
                event,
                node,
                checked: values.includes(val),
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
            expandNode,
            checkNode,
            hasSelected,
            hasChecked,
            hasIndeterminate,
            hasExpanded,
        });

        const classList = computed(() => [prefixCls].filter(Boolean).join(' '));
        const renderChildren = (arr) =>
            arr.map((item) => {
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
                const hasChildren =
                    Array.isArray(item.children) && item.children.length;
                return (
                    <TreeNode
                        v-show={!hiddenKeys.includes(item.value)}
                        node={item}
                        level={item.level}
                        value={item.value}
                        label={item.label}
                        disabled={item.disabled}
                        selectable={item.selectable}
                        checkable={item.checkable}
                        isLeaf={item.isLeaf}
                        handleData={handleData}
                        v-slots={itemSlots}
                    >
                        {hasChildren ? renderChildren(item.children) : null}
                    </TreeNode>
                );
            });
        const renderTreeNode = () => renderChildren(currentData.value);

        return () => (
            <div class={classList.value} role="tree">
                {renderTreeNode()}
            </div>
        );
    },
});
