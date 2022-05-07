import { defineComponent, provide, watch, VNodeChild, computed } from 'vue';
import { isFunction, isString, cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import CascaderNode from './cascaderNode';
import { COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import { cascaderProps, CASCADER_PROVIDE_KEY } from './props';
import Scrollbar from '../scrollbar';
import LoadingOutlined from '../icon/LoadingOutlined';
import { handleParent, handleChildren } from './helper';

import type { InnerCascaderOption, CascaderNodeKey } from './interface';
import { useLocale } from '../config-provider/useLocale';

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
            hasLoaded,
            hasCheckLoaded,
        } = useState(props, { emit });

        const { nodeList, getMenuNodes, menuKeys, initialLoaded } = useData({
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

        const { t } = useLocale();
        const listEmptyText = computed(
            () => props.emptyText || t('select.emptyText'),
        );

        const updateExpandedKeysBySelectOrCheck = (
            val: CascaderNodeKey,
            event: Event,
        ) => {
            const node = nodeList[val];
            const values = node.indexPath.slice(0, node.indexPath.length - 1);
            if (node.hasChildren) {
                values.push(node.value);
            }
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: values.includes(val),
            });
        };

        const selectNode = (val: CascaderNodeKey, event: Event) => {
            if (!props.selectable) {
                return;
            }
            updateExpandedKeysBySelectOrCheck(val, event);

            const node = nodeList[val];
            const values = cloneDeep(currentSelectedKeys.value);
            const index = values.indexOf(val);
            if (props.multiple) {
                if (index !== -1) {
                    props.cancelable && values.splice(index, 1);
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                props.cancelable && values.splice(index, 1);
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
            const values = [...node.indexPath];
            updateExpandedKeys(values);
            emit('expand', {
                expandedKeys: values,
                event,
                node,
                expanded: values.includes(val),
            });
        };

        function getCheckedKeys(arr: CascaderNodeKey[]) {
            return props.cascade
                ? arr.filter((key) => {
                      const node = nodeList[key];
                      // 兼容异步加载，未匹配到节点的情况
                      if (!node) {
                          return false; // 清除未匹配到的选中项
                      }
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
        
        const checkNode = (val: CascaderNodeKey, event: Event) => {
            updateExpandedKeysBySelectOrCheck(val, event);

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
                handleParent(values, indexPath, false, nodeList);
                if (!isLeaf) {
                    handleChildren(values, children, false);
                }
            } else {
                values.push(val);
                handleParent(values, indexPath, true, nodeList);
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
            hasLoaded,
            hasCheckLoaded,
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

        const renderMenu = (key: CascaderNodeKey) => {
            const nodes = getMenuNodes(key);

            return (
                <Scrollbar containerClass={`${prefixCls}-dropdown`} key={key}>
                    <div class={`${prefixCls}-menu`} role="cascader-menu">
                        {nodes.length ? (
                            renderNodes(nodes)
                        ) : initialLoaded.value ? (
                            <div class={`${prefixCls}-null`}>
                                {listEmptyText.value}
                            </div>
                        ) : (
                            <div class={`${prefixCls}-loading`}>
                                <LoadingOutlined />
                            </div>
                        )}
                    </div>
                </Scrollbar>
            );
        };
        const renderMenus = (arr: CascaderNodeKey[]) =>
            arr.map((key) => renderMenu(key));

        return () => (
            <div class={prefixCls} role="cascader">
                {renderMenus(menuKeys.value)}
            </div>
        );
    },
});
