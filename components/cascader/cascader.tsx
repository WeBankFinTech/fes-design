import { defineComponent, provide, watch, VNodeChild } from 'vue';
import { isFunction, isString, cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CascaderNode from './cascaderNode';
import { COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import { cascaderProps, CASCADER_PROVIDE_KEY } from './props';
import Scrollbar from '../scrollbar';

import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderMenu,
} from './interface';

const prefixCls = getPrefixCls('cascader');

export default defineComponent({
    name: COMPONENT_NAME.CASCADER,
    props: {
        ...cascaderProps,
    },
    emits: [
        'update:expandedKeys',
        'update:checkedKeys',
        'update:selectedKeys',
        'update:nodeList',
        'check',
        'expand',
        'load',
        'select',
    ],
    setup(props, { emit, expose }) {
        useTheme();

        const {
            currentExpandedKeys,
            updateExpandedKeys,
            currentCheckedKeys,
            updateCheckedKeys,
            currentSelectedKeys,
            updateSelectedKeys,
            hasSelected,
            hasChecked,
            hasIndeterminate,
        } = useState(props, { emit });

        const { nodeList, currentData } = useData({
            props,
            currentExpandedKeys,
        });

        watch(
            nodeList,
            () => {
                emit('update:nodeList', nodeList);
            },
            {
                immediate: true,
            },
        );

        const selectNode = (val: CascaderNodeKey, event: Event) => {
            if (!props.selectable) {
                return;
            }
            const node = nodeList[val];
            const values = cloneDeep(currentSelectedKeys.value);
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

        const expandNode = (val: CascaderNodeKey, event: Event) => {
            const node = nodeList[val];
            let values: CascaderNodeKey[] = cloneDeep(
                currentExpandedKeys.value,
            );
            const index = values.indexOf(val);
            // 已经展开，忽略处理
            if (index !== -1) {
                return;
            }
            values = [...node.indexPath];
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: true,
            });
        };

        function getCheckedKeys(arr: CascaderNodeKey[]) {
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
        function handleChildren(
            arr: CascaderNodeKey[],
            children: InnerCascaderOption[],
            isAdd: boolean,
        ) {
            children &&
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
        function handleParent(
            arr: CascaderNodeKey[],
            indexPath: CascaderNodeKey[],
            isAdd: boolean,
        ) {
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
        const checkNode = (val: CascaderNodeKey, event: Event) => {
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
            });
        }

        provide(CASCADER_PROVIDE_KEY, {
            props,
            selectNode,
            expandNode,
            checkNode,
            hasSelected,
            hasChecked,
            hasIndeterminate,
            nodeList,
        });

        const renderNode = (node: InnerCascaderOption) => {
            const itemSlots: {
                [key: string]: () => VNodeChild | string;
            } = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix as string;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix as string;
            }
            return (
                <CascaderNode
                    key={node.value}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                ></CascaderNode>
            );
        };
        const renderNodes = (nodes: InnerCascaderOption[]) =>
            nodes.map((node) => renderNode(node));

        const renderMenu = (menu: CascaderMenu) => {
            return (
                <Scrollbar
                    containerClass={`${prefixCls}-dropdown`}
                    key={menu.key}
                >
                    <div class={`${prefixCls}-menu`} role="cascader-menu">
                        {renderNodes(menu.nodes)}
                    </div>
                </Scrollbar>
            );
        };
        const renderMenus = (arr: CascaderMenu[]) =>
            arr.map((menu) => renderMenu(menu));

        return () => (
            <div class={prefixCls} role="cascader">
                {renderMenus(currentData.value)}
            </div>
        );
    },
});
