import { defineComponent, provide, watch, computed } from 'vue';
import { cloneDeep } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useLocale } from '../config-provider/useLocale';
import CascaderMenu from './cascaderMenu';
import { COMPONENT_NAME, CHECK_STRATEGY } from './const';
import useData from './useData';
import useState from './useState';
import { cascaderProps, CASCADER_PROVIDE_KEY } from './props';
import { handleParent, handleChildren } from './helper';
import type { CascaderNodeKey } from './interface';

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
            hasActive,
        } = useState(props, { emit });

        const { transformData, nodeList, menuKeys, initialLoaded } = useData({
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
            // 叶子节点也包含在内，以便操作反馈
            const values = [...node.indexPath];
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
                    if (props.cancelable) {
                        values.splice(index, 1);
                    }
                } else {
                    values.push(val);
                }
            } else if (index !== -1) {
                if (props.cancelable) {
                    values.splice(index, 1);
                }
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
            hasActive,
            transformData,
            nodeList,
        });

        const renderMenu = (key: CascaderNodeKey) => {
            return (
                <CascaderMenu
                    menuKey={key}
                    initialLoaded={initialLoaded.value}
                    listEmptyText={listEmptyText.value}
                ></CascaderMenu>
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
