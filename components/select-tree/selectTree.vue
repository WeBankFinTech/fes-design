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
                    :filterable="filterable"
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
                <template v-if="virtualList && !inline">
                    <Tree
                        v-show="data.length"
                        ref="refTree"
                        :selectedKeys="selectedKeys"
                        :checkedKeys="checkedKeys"
                        :data="data"
                        :defaultExpandAll="defaultExpandAll"
                        :expandedKeys="expandedKeys"
                        :accordion="accordion"
                        :selectable="treeSelectable"
                        :checkable="treeCheckable"
                        :checkStrictly="checkStrictly"
                        :cascade="cascade"
                        :multiple="multiple"
                        :childrenField="childrenField"
                        :valueField="valueField"
                        :labelField="labelField"
                        :filterMethod="filterMethod"
                        :inline="inline"
                        :remote="remote"
                        :loadData="loadData"
                        virtualList
                        :style="dropdownStyle"
                        :class="`${prefixCls}-dropdown is-max-height`"
                        @update:nodeList="onChangeNodeList"
                        @select="handleSelect"
                        @check="handleCheck"
                        @mousedown.prevent
                    ></Tree>
                    <div
                        v-show="!data.length"
                        :class="`${prefixCls}-null`"
                        @mousedown.prevent
                    >
                        {{ listEmptyText }}
                    </div>
                </template>
                <template v-else>
                    <Scrollbar
                        :containerStyle="dropdownStyle"
                        :containerClass="`${prefixCls}-dropdown`"
                        @mousedown.prevent
                    >
                        <Tree
                            v-show="data.length"
                            ref="refTree"
                            :selectedKeys="selectedKeys"
                            :checkedKeys="checkedKeys"
                            :data="data"
                            :defaultExpandAll="defaultExpandAll"
                            :expandedKeys="expandedKeys"
                            :accordion="accordion"
                            :selectable="treeSelectable"
                            :checkable="treeCheckable"
                            :checkStrictly="checkStrictly"
                            :cascade="cascade"
                            :multiple="multiple"
                            :childrenField="childrenField"
                            :valueField="valueField"
                            :labelField="labelField"
                            :filterMethod="filterMethod"
                            :inline="inline"
                            :remote="remote"
                            :loadData="loadData"
                            @update:nodeList="onChangeNodeList"
                            @select="handleSelect"
                            @check="handleCheck"
                        ></Tree>
                        <div v-show="!data.length" :class="`${prefixCls}-null`">
                            {{ listEmptyText }}
                        </div>
                    </Scrollbar>
                </template>
            </template>
        </Popper>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    ref,
    shallowRef,
    triggerRef,
    unref,
    watch,
    computed,
    CSSProperties,
    PropType,
} from 'vue';
import { debounce } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Tree from '../tree/tree';
import Scrollbar from '../scrollbar/scrollbar.vue';
import { selectProps } from '../select/props';
import { treeProps } from '../tree/props';
import { useLocale } from '../config-provider/useLocale';
import type { SelectValue } from '../select/interface';
import type {
    SelectParams,
    CheckParams,
    InnerTreeOption,
    TreeNodeKey,
} from '../tree/interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('select-tree');

export const selectTreeProps = {
    ...selectProps,
    ...treeProps,
    modelValue: {
        type: [String, Number, Array] as PropType<
            string | number | Array<TreeNodeKey> | Array<Array<TreeNodeKey>>
        >,
    },
    showPath: {
        type: Boolean,
        default: false,
    },
    emitPath: {
        type: Boolean,
        default: false,
    },
} as const;

export type SelectTreeProps = ExtractPublicPropTypes<typeof selectTreeProps>;

export default defineComponent({
    name: 'FSelectTree',
    components: {
        Popper,
        SelectTrigger,
        Tree,
        Scrollbar,
    },
    props: selectTreeProps,
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
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
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);
        const filterText = ref('');

        const { t } = useLocale();
        const inputPlaceholder = computed(
            () => props.placeholder || t('select.placeholder'),
        );
        const listEmptyText = computed(
            () => props.emptyText || t('select.emptyText'),
        );
        const innerDisabled = computed(
            () => props.disabled || isFormDisabled.value,
        );

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));

            // trigger 在mounted 之后可能会改变
            if (isOpened.value && triggerDomRef.value) {
                triggerWidth.value = triggerDomRef.value.$el.offsetWidth;
            }
        });

        const handleChange = () => {
            emit(CHANGE_EVENT, currentValue.value);
            validate(CHANGE_EVENT);
        };

        const nodeList = shallowRef<Map<TreeNodeKey, InnerTreeOption>>(
            new Map(),
        );

        const onChangeNodeList = (data: Map<TreeNodeKey, InnerTreeOption>) => {
            nodeList.value = data;
            triggerRef(nodeList);
        };

        const getCurrentValueByKeys = (keys: TreeNodeKey[] = []) => {
            if (props.multiple) {
                return keys.map((key) => {
                    if (props.emitPath) {
                        const node = nodeList.value.get(key);
                        return [...(node?.indexPath || [key])];
                    }
                    return key;
                });
            }

            return props.emitPath
                ? [...(nodeList.value.get(keys[0])?.indexPath || [])]
                : keys[0];
        };

        const treeSelectable = computed(() => !props.multiple);
        const treeCheckable = computed(() => props.multiple);
        const selectedKeys = computed(() => {
            if (!props.multiple) {
                if (props.emitPath && Array.isArray(currentValue.value)) {
                    return [currentValue.value[currentValue.value.length - 1]];
                }
                return currentValue.value ? [currentValue.value] : [];
            }
            return [];
        });
        const checkedKeys = computed(() => {
            if (props.multiple && currentValue.value?.length) {
                const keys = currentValue.value.map((item: [] | string) =>
                    props.emitPath && Array.isArray(item)
                        ? item[item.length - 1]
                        : item,
                );
                return keys;
            }
            return [];
        });

        watch([() => props.checkStrictly, () => props.emitPath], () => {
            const value: null | [] =
                (props.multiple && props.cascade) || props.emitPath ? [] : null;
            updateCurrentValue(value);
            handleChange();
        });

        const handleClear = () => {
            const value: null | [] = props.multiple ? [] : null;
            if (
                props.multiple
                    ? currentValue.value.length
                    : currentValue.value !== null
            ) {
                updateCurrentValue(value);
                handleChange();
            }
            emit('clear');
        };

        const handleSelect = (data: SelectParams) => {
            if (innerDisabled.value) return;
            filterText.value = '';
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(getCurrentValueByKeys(data.selectedKeys));
            handleChange();
        };

        const handleCheck = (data: CheckParams) => {
            if (innerDisabled.value) return;
            filterText.value = '';
            if (!props.multiple) {
                isOpened.value = false;
            }
            updateCurrentValue(getCurrentValueByKeys(data.checkedKeys));
            handleChange();
        };

        /** 节点目标值 */
        const targetValues = computed((): TreeNodeKey[] => {
            let values = props.multiple
                ? currentValue.value
                : [currentValue.value];
            if (props.emitPath) {
                // 获取选中节点
                return values.map((item: []) => item[item.length - 1]);
            }
            return values;
        });

        const handleRemove = (value: SelectValue) => {
            if (!props.multiple) {
                return;
            }
            const findIndex = targetValues.value.indexOf(value as string);
            if (findIndex !== -1) {
                emit('removeTag', value);
                const values = [...targetValues.value];
                values.splice(findIndex, 1);
                updateCurrentValue(getCurrentValueByKeys(values));
                handleChange();
            }
        };

        const selectedOptions = computed(() => {
            const nodeListValue = nodeList.value;
            return targetValues.value
                .map((val: TreeNodeKey) => {
                    const node = nodeListValue.get(val);
                    if (!node) return;
                    if (props.showPath) {
                        return {
                            ...node,
                            label: node.indexPath
                                ?.map(
                                    (item) =>
                                        nodeListValue.get(item)?.label || item,
                                )
                                .join('/'),
                        };
                    } else {
                        return node;
                    }
                })
                .filter(Boolean);
        });

        const focus = (e: Event) => {
            emit('focus', e);
            validate('focus');
        };

        const blur = (e: Event) => {
            if (isOpened.value) {
                isOpened.value = false;
            }
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (val: string) => {
            filterText.value = val;
        };

        const refTree = ref(null);
        watch(
            filterText,
            debounce(() => {
                refTree.value.filter(filterText.value);
            }, 300),
        );
        const filterMethod = computed(() => {
            const defaultMethod = (value: string, node: InnerTreeOption) => {
                return node.label.indexOf(value) !== -1;
            };
            return props.filter || defaultMethod;
        });

        const triggerDomRef = ref();
        const triggerWidth = ref(0);

        const dropdownStyle = computed(() => {
            const style: CSSProperties = {};
            if (triggerWidth.value) {
                style['min-width'] = `${triggerWidth.value}px`;
            }
            return style;
        });
        return {
            prefixCls,
            isOpened,
            currentValue,
            handleRemove,
            handleClear,
            selectedOptions,
            focus,
            blur,
            handleFilterTextChange,
            treeSelectable,
            selectedKeys,
            treeCheckable,
            handleSelect,
            handleCheck,
            checkedKeys,
            refTree,
            filterMethod,
            triggerDomRef,
            dropdownStyle,
            onChangeNodeList,
            inputPlaceholder,
            listEmptyText,
            isError,
            attrs,
            innerDisabled,
        };
    },
});
</script>
