<template>
    <div
        tabindex="0"
        :class="triggerClass"
        @mouseenter="inputHoveringRef = true"
        @mouseleave="inputHoveringRef = false"
        @focusin="handleFocus"
        @focusout="handleBlur"
        @mousedown="handleMouseDown"
    >
        <div :class="[`${prefixCls}-label`, multiple && 'is-multiple']">
            <template v-if="!multiple">
                <template v-if="!filterable">
                    <Ellipsis v-if="!unSelectedRef">
                        <span :class="`${prefixCls}-label-text`">
                            {{ labelTextRef }}
                        </span>
                    </Ellipsis>
                    <span v-else :class="`${prefixCls}-label-placeholder`">
                        {{ placeholder }}
                    </span>
                </template>
                <template v-else>
                    <input
                        ref="inputRef"
                        :value="filterTextRef"
                        :placeholder="
                            isOpened || unSelectedRef
                                ? labelTextRef || placeholder
                                : ''
                        "
                        :class="`${prefixCls}-label-input`"
                        @input="handleInput"
                    />
                    <div
                        v-if="!(unSelectedRef || isOpened)"
                        :class="`${prefixCls}-label-overlay`"
                    >
                        <Ellipsis>
                            <span :class="`${prefixCls}-label-text`">
                                {{ labelTextRef }}
                            </span>
                        </Ellipsis>
                    </div>
                </template>
            </template>
            <template v-else>
                <Tag
                    v-for="(tag, index) in multiLabelRef"
                    :key="index"
                    type="info"
                    size="small"
                    :closable="tag.closable"
                    :class="`${prefixCls}-label-item`"
                    @close="handleRemove(index)"
                    @mousedown.prevent
                >
                    <Ellipsis>
                        <span :class="`${prefixCls}-label-text`">
                            {{ tag.label }}
                        </span>
                    </Ellipsis>
                </Tag>
                <div
                    v-if="unSelectedRef && !filterTextRef.length"
                    :class="[
                        `${prefixCls}-label-placeholder`,
                        `${prefixCls}-label-overlay`,
                    ]"
                >
                    {{ placeholder }}
                </div>
                <template v-if="filterable">
                    <input
                        ref="inputRef"
                        :value="filterTextRef"
                        :class="`${prefixCls}-label-input`"
                        :style="{
                            width: filterTextRef.length
                                ? `${filterTextRef.length * 14}px`
                                : '1em',
                        }"
                        @input="handleInput"
                    />
                </template>
            </template>
        </div>
        <div :class="`${prefixCls}-icons`" @mousedown.prevent>
            <UpOutlined
                v-show="isOpened && !hasClearRef"
                :class="`${prefixCls}-icon`"
            />
            <DownOutlined
                v-show="!isOpened && !hasClearRef"
                :class="`${prefixCls}-icon`"
            />
            <CloseCircleFilled
                v-if="clearable"
                v-show="hasClearRef"
                :class="`${prefixCls}-icon`"
                @click.stop="handleClear"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, computed, defineComponent, PropType, watch, nextTick } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import Ellipsis from '../ellipsis';
import Tag from '../tag/tag.vue';
import UpOutlined from '../icon/UpOutlined';
import DownOutlined from '../icon/DownOutlined';
import CloseCircleFilled from '../icon/CloseCircleFilled';

import type { SelectOption } from './interface';

const prefixCls = getPrefixCls('select-trigger');

const selectTriggerProps = {
    selectedOptions: {
        type: Array as PropType<SelectOption[]>,
        default(): SelectOption[] {
            return [];
        },
    },
    disabled: Boolean,
    clearable: Boolean,
    isOpened: Boolean,
    multiple: Boolean,
    filterable: Boolean,
    placeholder: String,
    collapseTags: Boolean,
    collapseTagsLimit: Number,
} as const;

export default defineComponent({
    name: 'FSelect',
    components: {
        Tag,
        Ellipsis,
        UpOutlined,
        DownOutlined,
        CloseCircleFilled,
    },
    props: selectTriggerProps,
    emits: ['remove', 'clear', 'focus', 'blur', 'input'],
    setup(props, { emit }) {
        useTheme();

        const inputHoveringRef = ref(false);
        const inputRef = ref();
        const filterTextRef = ref('');

        const unSelectedRef = computed(
            () => props.selectedOptions.length === 0,
        );

        const isFocus = ref(false);

        const handleFocus = (event: Event) => {
            if (props.disabled) return;
            isFocus.value = true;
            emit('focus', event);
        };

        const handleBlur = (event: Event) => {
            if (props.disabled) return;
            isFocus.value = false;
            filterTextRef.value = '';
            emit('input', filterTextRef.value);
            emit('blur', event);
        };

        const hasClearRef = computed(
            () =>
                !props.disabled &&
                props.clearable &&
                !unSelectedRef.value &&
                inputHoveringRef.value,
        );

        const triggerClass = computed(() => ({
            [`${prefixCls}`]: true,
            'is-active': props.isOpened || isFocus.value,
            'is-disabled': props.disabled,
            'is-multiple': props.multiple,
        }));

        const genTag = (option: SelectOption) => {
            const { label, value } = option;
            return {
                label: label || value || '',
                closable: !props.disabled,
            };
        };

        const labelTextRef = computed(() => {
            const options = props.selectedOptions;
            return options.length > 0 ? `${options[0].label}` || '' : '';
        });

        const multiLabelRef = computed(() => {
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

        const handleRemove = (index: number) => {
            if (props.disabled) return;
            emit('remove', props.selectedOptions[index].value);
        };

        const handleClear = () => {
            if (props.disabled) return;
            emit('clear');
        };

        const handleInput = (e: Event) => {
            if (props.disabled) return;
            filterTextRef.value = (e.target as HTMLInputElement).value;
            emit('input', filterTextRef.value);
        };

        const handleMouseDown = (e: Event) => {
            if (props.filterable && e.target !== inputRef.value) {
                e.preventDefault();
            }
        };

        watch(
            () => props.isOpened,
            (isOpened) => {
                if (isOpened) {
                    nextTick(() => {
                        if (!inputRef.value) return;
                        if (!props.filterable) return;
                        inputRef.value.focus();
                    });
                }
            },
        );

        watch(
            () => props.selectedOptions,
            () => {
                filterTextRef.value = '';
            },
            {
                deep: true,
            },
        );

        return {
            prefixCls,
            inputHoveringRef,
            hasClearRef,
            triggerClass,
            unSelectedRef,
            handleRemove,
            handleClear,
            handleFocus,
            handleBlur,
            inputRef,
            filterTextRef,
            handleInput,
            labelTextRef,
            multiLabelRef,
            handleMouseDown,
        };
    },
});
</script>
