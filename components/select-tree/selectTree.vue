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
                        :multiple="multiple"
                        :childrenField="childrenField"
                        :valueField="valueField"
                        :labelField="labelField"
                        :filterMethod="filterMethod"
                        :inline="inline"
                        :remote="remote"
                        :loadData="loadData"
                        @update:selectedKeys="handleSelect"
                        @update:checkedKeys="handleSelect"
                    ></Tree>
                    <div v-show="!data.length" :class="`${prefixCls}-null`">
                        {{ emptyText }}
                    </div>
                </Scrollbar>
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
import { flatNodes } from '../_util/utils';

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

        const nodes = computed(() => flatNodes(props.data));
        const treeSelectable = computed(() => !props.multiple);
        const treeCheckable = computed(() => props.multiple);
        const selectedKeys = computed(() => {
            if (!props.multiple)
                return currentValue.value ? [currentValue.value] : [];
            return [];
        });
        const checkedKeys = computed(() => {
            if (props.multiple) return currentValue.value;
            return [];
        });

        const handleClear = () => {
            const value = props.multiple ? [] : null;
            updateCurrentValue(value);
            emit('clear');
        };

        const handleSelect = (value) => {
            if (props.disabled) return;
            filterText.value = '';
            if (!props.multiple) {
                updateCurrentValue(value[0]);
                isOpened.value = false;
            } else {
                updateCurrentValue(value);
            }
        };

        const handleRemove = (value) => {
            if (!props.multiple) {
                return;
            }
            const arr = currentValue.value;
            const findIndex = arr.indexOf(value);
            if (findIndex !== -1) {
                emit('removeTag', value);
                arr.splice(findIndex, 1);
                updateCurrentValue(arr);
            }
        };

        const selectedOptions = computed(() =>
            nodes.value
                .map((option) => {
                    const value = option[props.valueField];
                    const label = option[props.labelField];
                    return {
                        ...option,
                        value,
                        label,
                    };
                })
                .filter((option) => {
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
            checkedKeys,
            refTree,
            filterMethod,
            triggerRef,
            dropdownStyle,
        };
    },
});
</script>
