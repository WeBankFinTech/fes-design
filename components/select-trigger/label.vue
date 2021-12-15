<template>
    <div :class="[prefixCls, multiple && 'is-multiple']">
        <template v-if="!multiple">
            <Ellipsis v-if="!(isOpened || unSelected)">
                <span :class="`${prefixCls}-text`">{{ singleLabel }}</span>
            </Ellipsis>
            <div v-else :class="`${prefixCls}-placeholder`">
                <input
                    ref="inputRef"
                    :value="singleLabel || filterText"
                    :placeholder="placeholder"
                    :class="`${prefixCls}-input`"
                    :readonly="!filterable"
                    @input="handleInput"
                />
            </div>
        </template>
        <template v-else>
            <Tag
                v-for="(label, index) in multiLabels"
                :key="index"
                type="info"
                size="small"
                :closable="!disabled"
                :class="`${prefixCls}-item`"
                @close="handleRemoveTag(index)"
            >
                <Ellipsis>
                    <span :class="`${prefixCls}-text`">{{ label }}</span>
                </Ellipsis>
            </Tag>
            <template v-if="filterable">
                <div v-if="isOpened || unSelected" :class="`${prefixCls}-placeholder`">
                    <input ref="inputRef" :value="filterText" :placeholder="placeholder" :class="`${prefixCls}-input`" @input="handleInput" />
                </div>
            </template>
            <template v-else>
                <div v-if="unSelected" :class="`${prefixCls}-placeholder`">
                    <input ref="inputRef" :value="filterText" :placeholder="placeholder" :class="`${prefixCls}-input`" readonly @input="handleInput" />
                </div>
            </template>
        </template>
    </div>
</template>
<script>
import { computed, nextTick, ref, watch } from 'vue';
import Ellipsis from '../ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import Tag from '../tag';

const prefixCls = getPrefixCls('select-trigger-label');
export default {
    name: 'WLabel',
    components: { Tag, Ellipsis },
    props: {
        placeholder: String,
        filterable: Boolean,
        isOpened: Boolean,
        disabled: Boolean,
        selectedOptions: {
            type: [Array],
            default() {
                return [];
            },
        },
        multiple: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['removeTag', 'input'],
    setup(props, { emit }) {
        const inputRef = ref();
        const filterText = ref('');
        const unSelected = computed(() => props.selectedOptions.length === 0);
        const singleLabel = computed(() => {
            const options = props.selectedOptions;
            return options.length > 0 ? options[0].label || options[0].value : '';
        });
        const multiLabels = computed(() => {
            const options = props.selectedOptions;
            return options.map((v) => v.label || options[0].value || '');
        });

        watch(
            () => props.isOpened,
            (isOpened) => {
                if (isOpened) {
                    nextTick(() => {
                        if (!inputRef.value) return;
                        inputRef.value.focus();
                    });
                } else {
                    nextTick(() => {
                        if (!inputRef.value) return;
                        inputRef.value.blur();
                    });
                }
            },
        );

        watch(multiLabels, () => {
            if (props.isOpened) {
                filterText.value = '';
                nextTick(() => {
                    if (!inputRef.value) return;
                    inputRef.value.focus();
                });
            }
        });

        const handleRemoveTag = (index) => {
            emit('removeTag', props.selectedOptions[index].value);
        };
        const handleInput = (e) => {
            filterText.value = e.target.value;
            emit('input', filterText.value);
        };
        return {
            singleLabel,
            multiLabels,
            prefixCls,
            handleRemoveTag,
            unSelected,
            filterText,
            inputRef,
            handleInput,
        };
    },
};
</script>
