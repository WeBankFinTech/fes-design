<template>
    <div :class="prefixCls">
        <Popper
            v-model="isOpened"
            trigger="click"
            placement="bottom-start"
            :popperClass="`${prefixCls}-popper`"
            :appendToContainer="appendToContainer"
            :getContainer="getContainer"
            :offset="4"
            :hideAfter="0"
            :disabled="innerDisabled"
            :lazy="false"
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerDomRef"
                    :selectedOptions="selectedOptions"
                    :disabled="innerDisabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="inputPlaceholder"
                    :filterable="innerFilterable"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
                    :tagBordered="tagBordered"
                    :class="[{ 'is-error': isError }, attrs.class]"
                    :style="attrs.style"
                    :renderTag="$slots.tag"
                    @remove="handleRemove"
                    @clear="handleClear"
                    @focus="focus"
                    @blur="blur"
                    @input="handleFilterTextChange"
                />
            </template>
            <template #default>
                <Cascader
                    v-show="!filterText"
                    ref="cascaderRef"
                    v-model:expandedKeys="expandedKeys"
                    :selectedKeys="selectedKeys"
                    :checkedKeys="checkedKeys"
                    :initLoadKeys="initLoadKeys"
                    :data="data"
                    :emptyText="listEmptyText"
                    :selectable="cascaderSelectable"
                    :checkable="cascaderCheckable"
                    :checkStrictly="checkStrictly"
                    :cascade="cascade"
                    :multiple="multiple"
                    :childrenField="childrenField"
                    :valueField="valueField"
                    :labelField="labelField"
                    :remote="remote"
                    :loadData="loadData"
                    :expandTrigger="expandTrigger"
                    :isOpened="isOpened"
                    @update:nodeList="onChangeNodeList"
                    @select="handleSelect"
                    @check="handleCheck"
                    @mousedown.prevent
                ></Cascader>
                <OptionList
                    v-show="filterText"
                    :options="filteredOptions"
                    :prefixCls="selectPrefixCls"
                    :containerStyle="filterDropdownStyle"
                    :isSelect="filterIsSelect"
                    :onSelect="handleFilterSelect"
                    :emptyText="filterEmptyText"
                    @mousedown.prevent
                />
            </template>
        </Popper>
    </div>
</template>

<script lang="ts">
import {
    type CSSProperties,
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    ref,
    unref,
    watch,
} from 'vue';
import { debounce, isArray } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import {
    type UseArrayModelReturn,
    useArrayModel,
    useNormalModel,
} from '../_util/use/useModel';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Cascader from '../cascader/cascader';
import { selectProps } from '../select/props';
import { cascaderProps } from '../cascader/props';
import {
    getCascadeChildrenByKeys,
    getCascadeParentByKeys,
    handleChildren,
    handleParent,
} from '../cascader/helper';
import { useLocale } from '../config-provider/useLocale';
import { CHECK_STRATEGY } from '../cascader/const';
import OptionList from '../select/optionList';
import { prefixCls as selectPrefixCls } from '../select/const';
import type {
    CascaderNodeKey,
    CascaderNodeList,
    CascaderOption,
    CheckParams,
    InnerCascaderOption,
    SelectParams,
} from '../cascader/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';
import {
    getCurrentValueByKeys,
    getExpandedKeysBySelectedKeys,
    getKeysByCurrentValue,
    getNotMatchedPathByKey,
} from './helper';

import { LABEL_SEPARATOR, SELECT_CASCADER_NAME } from './const';

const prefixCls = getPrefixCls('select-cascader');

export const selectCascaderProps = {
    ...selectProps,
    ...cascaderProps,
    modelValue: {
        type: [String, Number, Array] as PropType<
            | CascaderNodeKey
            | Array<CascaderNodeKey>
            | Array<Array<CascaderNodeKey>>
        >,
    },
} as const satisfies ComponentObjectPropsOptions;

export type SelectCascaderProps = ExtractPublicPropTypes<
    typeof selectCascaderProps
>;

export default defineComponent({
    name: SELECT_CASCADER_NAME,
    components: {
        Popper,
        SelectTrigger,
        Cascader,
        OptionList,
    },
    props: selectCascaderProps,
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'update:expandedKeys',
        'removeTag',
        'visibleChange',
        'focus',
        'blur',
        'clear',
    ],
    setup(props, { emit, attrs }) {
        useTheme();
        const { validate, isError, isFormDisabled } = useFormAdaptor({
            valueType: computed(() => (props.multiple ? 'array' : 'string')),
        });
        const isOpened = ref(false);

        const [currentValue, updateCurrentValue] = props.multiple
            ? // 与 props 中 modelValue 类型保持一致
              (useArrayModel(props, emit) as unknown as UseArrayModelReturn<
                  Array<CascaderNodeKey> | Array<Array<CascaderNodeKey>>
              >)
            : useNormalModel(props, emit);

        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );

        const cascaderRef = ref();
        const triggerDomRef = ref();
        const triggerWidth = ref(0);

        const innerFilterable = computed(() => {
            if (props.filterable && props.remote) {
                console.warn(
                    `[${SELECT_CASCADER_NAME}]: remote 被设定时, filterable 不生效`,
                );
            }
            return props.filterable && !props.remote && !innerDisabled.value;
        });
        const filterText = ref('');
        const filteredOptions = ref<InnerCascaderOption[]>([]);

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('select.placeholder'),
        );
        const listEmptyText = computed(
            () => props.emptyText || t('select.emptyText'),
        );
        const filterEmptyText = computed(() => t('select.filterEmptyText'));

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));

            // trigger 在 mounted 之后可能会改变
            if (isOpened.value && triggerDomRef.value) {
                triggerWidth.value = triggerDomRef.value.$el.offsetWidth;
            }
        });

        const handleChange = () => {
            emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };

        const nodeList = ref<CascaderNodeList>({});

        const onChangeNodeList = (data: CascaderNodeList) => {
            nodeList.value = data;
        };
        // 为避免过滤项之间选中操作相互干扰，这里仅过滤叶子节点
        const filterNodeList = computed(() => {
            const list: InnerCascaderOption[] = [];
            if (innerFilterable.value) {
                Object.keys(nodeList.value).forEach((key) => {
                    if (!nodeList.value[key].hasChildren) {
                        list.push(nodeList.value[key]);
                    }
                });
            }
            return list;
        });

        const cascaderSelectable = computed(() => !props.multiple);
        const cascaderCheckable = computed(() => props.multiple);
        const selectedKeys = computed(() => {
            if (!props.multiple) {
                return getKeysByCurrentValue(currentValue.value, props);
            }
            return [];
        });
        const expandedKeys = computed({
            get: () => {
                if (!props.multiple) {
                    return getExpandedKeysBySelectedKeys(
                        nodeList.value,
                        selectedKeys.value as CascaderNodeKey[],
                    );
                }
                return [];
            },
            set: (nextValue) => {
                emit('update:expandedKeys', nextValue);
            },
        });
        const checkedKeys = computed(() => {
            if (props.multiple) {
                const keys = getKeysByCurrentValue(currentValue.value, props);
                if (!props.cascade) {
                    return keys;
                }
                if (props.checkStrictly === CHECK_STRATEGY.ALL) {
                    return keys;
                }
                if (props.checkStrictly === CHECK_STRATEGY.PARENT) {
                    return getCascadeChildrenByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
                if (props.checkStrictly === CHECK_STRATEGY.CHILD) {
                    return getCascadeParentByKeys(
                        nodeList.value,
                        keys as CascaderNodeKey[],
                    );
                }
            }
            return [];
        });
        const initLoadKeys = computed(() => {
            let keys: CascaderNodeKey[] = [];
            if (!(props.remote && props.loadData)) {
                return keys;
            }
            if (!props.emitPath) {
                return keys;
            }
            if (!isArray(currentValue.value)) {
                return keys;
            }
            currentValue.value.forEach((value) => (keys = keys.concat(value)));
            keys = Array.from(new Set(keys)); // 去重处理
            return keys;
        });

        watch(
            () => props.checkStrictly,
            () => {
                if (props.multiple && props.cascade) {
                    updateCurrentValue([]);
                    handleChange();
                }
            },
        );

        watch([() => props.emitPath, () => props.cascade], () => {
            const value: null | [] =
                props.multiple || props.emitPath ? [] : null;

            updateCurrentValue(value);
            handleChange();
        });

        const handleClear = () => {
            const value: null | [] =
                props.multiple || props.emitPath ? [] : null;

            if (
                props.multiple
                    ? checkedKeys.value.length
                    : selectedKeys.value.length
            ) {
                updateCurrentValue(value);
                handleChange();
            }

            filterText.value = '';
            emit('clear');
        };

        const handleSelect = (data: SelectParams) => {
            if (innerDisabled.value) return;
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(
                getCurrentValueByKeys(nodeList.value, data.selectedKeys, props),
            );
            handleChange();
        };

        const handleCheck = (data: CheckParams) => {
            if (innerDisabled.value) return;
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(
                getCurrentValueByKeys(nodeList.value, data.checkedKeys, props),
            );
            handleChange();
        };

        const handleRemove = (value: CascaderNodeKey) => {
            if (!props.multiple) {
                return;
            }

            const values = getKeysByCurrentValue(currentValue.value, props);
            const findIndex = (values as CascaderNodeKey[]).indexOf(
                value as CascaderNodeKey,
            );
            if (findIndex !== -1) {
                emit('removeTag', value);

                // 兼容关联场景
                if (!props.cascade) {
                    values.splice(findIndex, 1);
                } else {
                    const { isLeaf, children, indexPath } =
                        nodeList.value[value as CascaderNodeKey];

                    values.splice(findIndex, 1);

                    handleParent(
                        values as CascaderNodeKey[],
                        indexPath,
                        false,
                        nodeList.value,
                    );
                    if (!isLeaf) {
                        handleChildren(
                            values as CascaderNodeKey[],
                            children,
                            false,
                        );
                    }
                }

                updateCurrentValue(
                    getCurrentValueByKeys(
                        nodeList.value,
                        values as CascaderNodeKey[],
                        props,
                    ),
                );
                handleChange();
            }
        };

        const selectedOptions = computed(() => {
            const values = getKeysByCurrentValue(currentValue.value, props);

            // 兼容异步加载，未匹配到节点的情况
            return (values as CascaderNodeKey[])
                .filter(Boolean)
                .map((curValue) => {
                    const { value, label, path } = nodeList.value[curValue] || {
                        value: curValue,
                        label: curValue,
                        path: getNotMatchedPathByKey(
                            currentValue.value,
                            props,
                            curValue,
                        ),
                    };
                    const formatLabel = props.showPath
                        ? (path as CascaderOption[])
                              .map((item) => `${item.label}`)
                              .join(LABEL_SEPARATOR)
                        : label;
                    return {
                        value,
                        label: formatLabel,
                        path,
                    };
                });
        });

        const focus = (e: Event) => {
            emit('focus', e);
            validate('focus');
        };

        const blur = (e: Event) => {
            if (isOpened.value) {
                isOpened.value = false;
            }
            filterText.value = '';
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (val: string) => {
            filterText.value = val;
        };
        watch(
            filterText,
            debounce(() => {
                let currentNodeList: InnerCascaderOption[] = [];
                if (innerFilterable.value && filterText.value) {
                    filterNodeList.value.forEach((node) => {
                        let isFilter = false;
                        const labelList = node.path.map(
                            (item: any) => item.label,
                        );
                        if (props.filter) {
                            isFilter = props.filter(filterText.value, node);
                        } else {
                            isFilter = labelList.some((label: any) =>
                                String(label).includes(filterText.value),
                            );
                        }
                        if (isFilter) {
                            currentNodeList.push({
                                value: node.value,
                                label: labelList.join(LABEL_SEPARATOR),
                                disabled: node.disabled,
                            });
                        }
                    });
                }
                filteredOptions.value = currentNodeList;
            }, 300),
        );
        const filterIsSelect = (value: CascaderNodeKey) => {
            const optVal = unref(value);
            if (cascaderSelectable.value) {
                return selectedKeys.value.includes(optVal);
            }
            if (cascaderCheckable.value) {
                return checkedKeys.value.includes(optVal);
            }
        };
        const filterDropdownStyle = computed(() => {
            const style: CSSProperties = {};
            if (triggerWidth.value) {
                style['min-width'] = `${triggerWidth.value}px`;
            }
            return style;
        });
        const handleFilterSelect = (value: CascaderNodeKey) => {
            if (cascaderSelectable.value) {
                cascaderRef.value?.selectNode(value);
                filterText.value = '';
            }
            if (cascaderCheckable.value) {
                cascaderRef.value?.checkNode(value);
            }
        };

        return {
            triggerDomRef,
            cascaderRef,
            prefixCls,
            selectPrefixCls,
            isOpened,
            currentValue,
            handleRemove,
            handleClear,
            selectedOptions,
            focus,
            blur,
            handleFilterTextChange,
            cascaderSelectable,
            selectedKeys,
            expandedKeys,
            cascaderCheckable,
            handleSelect,
            handleCheck,
            checkedKeys,
            onChangeNodeList,
            inputPlaceholder,
            isError,
            initLoadKeys,
            attrs,
            innerDisabled,
            innerFilterable,
            listEmptyText,
            filterEmptyText,
            filterText,
            filteredOptions,
            filterIsSelect,
            filterDropdownStyle,
            handleFilterSelect,
        };
    },
});
</script>
