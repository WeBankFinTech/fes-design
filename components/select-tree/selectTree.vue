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
            :disabled="disabled"
        >
            <template #trigger>
                <SelectTrigger
                    ref="triggerRef"
                    :selectedOptions="selectedOptions"
                    :disabled="disabled"
                    :clearable="clearable"
                    :isOpened="isOpened"
                    :multiple="multiple"
                    :placeholder="placeholder"
                    :filterable="filterable"
                    :collapseTags="collapseTags"
                    :collapseTagsLimit="collapseTagsLimit"
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
                    ></Tree>
                    <div v-show="!data.length" :class="`${prefixCls}-null`">
                        {{ emptyText }}
                    </div>
                </template>
                <template v-else>
                    <Scrollbar
                        :containerStyle="dropdownStyle"
                        :containerClass="`${prefixCls}-dropdown`"
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
                            {{ emptyText }}
                        </div>
                    </Scrollbar>
                </template>
            </template>
        </Popper>
    </div>
</template>
<script>
import { defineComponent, ref, unref, watch, computed, onMounted } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { useNormalModel, useArrayModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import Popper from '../popper';
import SelectTrigger from '../select-trigger';
import Tree from '../tree';
import Scrollbar from '../scrollbar';
import SELECT_PROPS from '../select/props';
import TREE_PROPS from '../tree/props';
import { getChildrenByValues, getParentByValues } from './helper';

const prefixCls = getPrefixCls('select-tree');

export default defineComponent({
    name: 'FSelectTree',
    components: {
        Popper,
        SelectTrigger,
        Tree,
        Scrollbar,
    },
    props: {
        ...SELECT_PROPS,
        ...TREE_PROPS,
    },
    emits: [
        UPDATE_MODEL_EVENT,
        CHANGE_EVENT,
        'removeTag',
        'visibleChange',
        'focus',
        'blur',
        'clear',
    ],
    setup(props, { emit }) {
        useTheme();
        const { validate } = useFormAdaptor(
            computed(() => (props.multiple ? 'array' : 'string')),
        );
        const isOpened = ref(false);
        const [currentValue, updateCurrentValue] = props.multiple
            ? useArrayModel(props, emit)
            : useNormalModel(props, emit);
        const filterText = ref('');

        watch(isOpened, () => {
            emit('visibleChange', unref(isOpened));
        });
        watch(currentValue, () => {
            emit(CHANGE_EVENT, unref(currentValue));
            validate(CHANGE_EVENT);
        });

        const nodeList = ref([]);

        const onChangeNodeList = (data) => {
            nodeList.value = data;
        };

        const treeSelectable = computed(() => !props.multiple);
        const treeCheckable = computed(() => props.multiple);
        const selectedKeys = computed(() => {
            if (!props.multiple)
                return currentValue.value ? [currentValue.value] : [];
            return [];
        });
        const checkedKeys = computed(() => {
            if (props.multiple) {
                if (!props.cascade) {
                    return currentValue.value;
                }
                if (props.checkStrictly === 'all') {
                    return currentValue.value;
                }
                if (props.checkStrictly === 'parent') {
                    return getChildrenByValues(
                        nodeList.value,
                        currentValue.value,
                    );
                }
                if (props.checkStrictly === 'child') {
                    return getParentByValues(
                        nodeList.value,
                        currentValue.value,
                    );
                }
            }
            return [];
        });

        watch(
            () => props.checkStrictly,
            () => {
                if (props.multiple && props.cascade) {
                    updateCurrentValue([]);
                }
            },
        );

        const handleClear = () => {
            const value = props.multiple ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };

        const handleSelect = (data) => {
            if (props.disabled) return;
            filterText.value = '';
            if (!props.multiple) {
                updateCurrentValue(data.selectedKeys[0]);
                isOpened.value = false;
            } else {
                updateCurrentValue(data.selectedKeys);
            }
        };

        const handleCheck = (data) => {
            if (props.disabled) return;
            filterText.value = '';
            if (!props.multiple) {
                updateCurrentValue(data.checkedKeys[0]);
                isOpened.value = false;
            } else {
                updateCurrentValue(data.checkedKeys);
            }
        };

        const handleRemove = (value) => {
            if (!props.multiple) {
                return;
            }
            const findIndex = currentValue.value.indexOf(value);
            if (findIndex !== -1) {
                emit('removeTag', value);
                // arrayModel会自动添加或者删除
                updateCurrentValue(value);
            }
        };

        const selectedOptions = computed(() =>
            Object.values(nodeList.value).filter((option) => {
                if (props.multiple) {
                    return currentValue.value.includes(option.value);
                }
                return [currentValue.value].includes(option.value);
            }),
        );

        const focus = (e) => {
            emit('focus', e);
        };

        const blur = (e) => {
            emit('blur', e);
            validate('blur');
        };

        const handleFilterTextChange = (val) => {
            filterText.value = val;
        };

        const refTree = ref(null);
        watch(filterText, () => {
            refTree.value.filter(filterText.value);
        });
        const filterMethod = (value, node) => node.label.indexOf(value) !== -1;

        const triggerRef = ref();
        const triggerWidth = ref(0);

        onMounted(() => {
            if (triggerRef.value) {
                triggerWidth.value = triggerRef.value.$el.offsetWidth;
            }
        });

        const dropdownStyle = computed(() => {
            const style = {};
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
            triggerRef,
            dropdownStyle,
            onChangeNodeList,
        };
    },
});
</script>
