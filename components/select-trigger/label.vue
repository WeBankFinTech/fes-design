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
                v-for="(tag, index) in multiLabels"
                :key="index"
                type="info"
                size="small"
                :closable="tag.closable"
                :class="`${prefixCls}-item`"
                @close="handleRemoveTag(index)"
            >
                <Ellipsis>
                    <span :class="`${prefixCls}-text`">{{ tag.label }}</span>
                </Ellipsis>
            </Tag>
            <template v-if="filterable">
                <div
                    v-if="isOpened || unSelected"
                    :class="`${prefixCls}-placeholder`"
                >
                    <input
                        ref="inputRef"
                        :value="filterText"
                        :placeholder="placeholder"
                        :class="`${prefixCls}-input`"
                        @input="handleInput"
                    />
                </div>
            </template>
            <template v-else>
                <div v-if="unSelected" :class="`${prefixCls}-placeholder`">
                    <input
                        ref="inputRef"
                        :value="filterText"
                        :placeholder="placeholder"
                        :class="`${prefixCls}-input`"
                        readonly
                        @input="handleInput"
                    />
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, nextTick, ref, watch, PropType } from 'vue';
import Ellipsis from '../ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import Tag from '../tag/tag.vue';

import type { SelectOption } from './interface';

const prefixCls = getPrefixCls('select-trigger-label');

const labelProps = {
    placeholder: String,
    filterable: Boolean,
    isOpened: Boolean,
    disabled: Boolean,
    selectedOptions: {
        type: Array as PropType<SelectOption[]>,
        default(): SelectOption[] {
            return [];
        },
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    collapseTags: {
        type: Boolean,
        default: false,
    },
    collapseTagsLimit: {
        type: Number,
        default: 1,
    },
} as const;

export default defineComponent({
    name: 'FLabel',
    components: { Tag, Ellipsis },
    props: labelProps,
    emits: ['removeTag', 'input'],
    setup(props, { emit }) {
        const inputRef = ref();
        const filterText = ref('');

        const genTag = (option: SelectOption) => {
            const { label, value } = option;
            return {
                label: label || value || '',
                closable: !props.disabled,
            };
        };

        const unSelected = computed(() => props.selectedOptions.length === 0);
        const singleLabel = computed(() => {
            const options = props.selectedOptions;
            return options.length > 0
                ? options[0].label || options[0].value
                : '';
        });
        const multiLabels = computed(() => {
            const options = props.selectedOptions;
            const tags = [];

            if (props.collapseTags) {
                const showOptions = options.slice(0, props.collapseTagsLimit);
                const rest = options.slice(props.collapseTagsLimit);
                const restCount = rest.length;

                showOptions.forEach((option) => tags.push(genTag(option)));

                if (restCount > 0) {
                    tags.push({
                        label: `+ ${restCount}`,
                        closable: false,
                    });
                }
            } else {
                options.forEach((option) => tags.push(genTag(option)));
            }

            return tags;
        });

        watch(
            () => props.isOpened,
            (isOpened) => {
                if (isOpened) {
                    nextTick(() => {
                        if (!inputRef.value) return;
                        if (!props.filterable) return;
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
                    if (!props.filterable) return;
                    inputRef.value.focus();
                });
            }
        });

        const handleRemoveTag = (index: number) => {
            emit('removeTag', props.selectedOptions[index].value);
        };
        const handleInput = (e: Event) => {
            filterText.value = (e.target as HTMLInputElement).value;
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
});
</script>
