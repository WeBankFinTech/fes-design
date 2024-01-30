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
        <div
            :class="[
                `${prefixCls}-label`,
                multiple && 'is-multiple',
                unSelectedRef && 'is-selected-null',
            ]"
        >
            <template v-if="!multiple">
                <template v-if="!filterable">
                    <RenderTag
                        v-if="!unSelectedRef"
                        :renderTag="renderTag"
                        :option="selectedOptions[0]"
                    >
                        <Ellipsis
                            :class="`${prefixCls}-label-text`"
                            :content="labelTextRef"
                        >
                        </Ellipsis>
                    </RenderTag>
                    <div v-else :class="`${prefixCls}-label-placeholder`">
                        {{ placeholder }}
                    </div>
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
                        :disabled="disabled"
                        @input="handleInput"
                        @compositionstart="handleCompositionStart"
                        @compositionupdate="handleCompositionUpdate"
                        @compositionend="handleCompositionEnd"
                    />
                    <div
                        v-if="!(unSelectedRef || isOpened)"
                        :class="`${prefixCls}-label-overlay`"
                    >
                        <RenderTag
                            :renderTag="renderTag"
                            :option="selectedOptions[0]"
                        >
                            <Ellipsis
                                :class="`${prefixCls}-label-text`"
                                :content="labelTextRef"
                            >
                            </Ellipsis>
                        </RenderTag>
                    </div>
                </template>
            </template>
            <template v-else>
                <RenderTag
                    v-for="(tag, index) in multiLabelRef"
                    :key="index"
                    :renderTag="renderTag"
                    :option="tag"
                    @close="handleRemove(index)"
                >
                    <template v-if="tag.isCollapsed">
                        <Tooltip
                            mode="popover"
                            placement="top"
                            trigger="hover"
                            :offset="11"
                            :popper-class="`${prefixCls}-collapsed-item-popper`"
                        >
                            <Tag
                                type="info"
                                size="small"
                                :closable="tag.closable"
                                :class="`${prefixCls}-label-item`"
                                :bordered="hasTagBordered"
                                @close="handleRemove(index)"
                            >
                                {{ tag.label }}
                            </Tag>
                            <template #content>
                                <Tag
                                    v-for="(
                                        collapsedTag, collapsedTagIndex
                                    ) in tag.collapsedOptions"
                                    :key="collapsedTagIndex"
                                    type="info"
                                    size="small"
                                    :class="[
                                        `${prefixCls}-label-item`,
                                        `${prefixCls}-label-collapsed-item`,
                                    ]"
                                    :closable="collapsedTag.closable"
                                    :bordered="hasTagBordered"
                                    @close="
                                        handleRemove(
                                            calcCollapseTagIndex(
                                                collapsedTagIndex,
                                            ),
                                        )
                                    "
                                >
                                    <Ellipsis
                                        :class="`${prefixCls}-label-text`"
                                        :content="collapsedTag.label"
                                    />
                                </Tag>
                            </template>
                        </Tooltip>
                    </template>
                    <template v-else>
                        <Tag
                            type="info"
                            size="small"
                            :closable="tag.closable"
                            :class="`${prefixCls}-label-item`"
                            :bordered="hasTagBordered"
                            @close="handleRemove(index)"
                        >
                            <Ellipsis
                                :class="`${prefixCls}-label-text`"
                                :content="tag.label"
                            />
                        </Tag>
                    </template>
                </RenderTag>
                <div
                    v-if="
                        unSelectedRef &&
                        !filterTextRef.length &&
                        !isComposingRef
                    "
                    :class="[
                        `${prefixCls}-label-placeholder`,
                        `${prefixCls}-label-overlay`,
                    ]"
                >
                    {{ placeholder }}
                </div>
                <input
                    v-if="filterable"
                    ref="inputRef"
                    :value="filterTextRef"
                    :class="`${prefixCls}-label-input`"
                    :style="{
                        width: inputWidthRef,
                    }"
                    :disabled="disabled"
                    @compositionstart="handleCompositionStart"
                    @compositionend="handleCompositionEnd"
                    @compositionupdate="handleCompositionUpdate"
                    @input="handleInput"
                />
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
import {
    ref,
    computed,
    defineComponent,
    type PropType,
    watch,
    nextTick,
    type VNodeChild,
    type ComponentObjectPropsOptions,
} from 'vue';
import { isEqual, isNil } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import Ellipsis from '../ellipsis';
import Tooltip from '../tooltip';
import Tag from '../tag/tag.vue';
import UpOutlined from '../icon/UpOutlined';
import DownOutlined from '../icon/DownOutlined';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import RenderTag from './renderTag';

import type {
    SelectOption,
    RenderTagParam,
    SelectTagWithCollapse,
} from './interface';

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
    renderTag: Function as PropType<(option: RenderTagParam) => VNodeChild>,
    tagBordered: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export default defineComponent({
    name: 'FSelect',
    components: {
        Tag,
        Ellipsis,
        Tooltip,
        UpOutlined,
        DownOutlined,
        CloseCircleFilled,
        RenderTag,
    },
    props: selectTriggerProps,
    emits: ['remove', 'clear', 'focus', 'blur', 'input'],
    setup(props, { emit }) {
        useTheme();

        const inputHoveringRef = ref(false);
        const inputRef = ref();
        const filterTextRef = ref('');
        const isComposingRef = ref(false);
        const compositionValueRef = ref('');
        const isFocusRef = ref(false);

        const unSelectedRef = computed(
            () => props.selectedOptions.length === 0,
        );

        const hasClearRef = computed(
            () =>
                !props.disabled &&
                props.clearable &&
                !unSelectedRef.value &&
                inputHoveringRef.value,
        );

        const inputWidthRef = computed(() => {
            const totalText = filterTextRef.value + compositionValueRef.value;
            return totalText.length ? `${totalText.length + 1}em` : '1em';
        });

        const triggerClass = computed(() => ({
            [`${prefixCls}`]: true,
            'is-active': props.isOpened || isFocusRef.value,
            'is-disabled': props.disabled,
            'is-multiple': props.multiple,
        }));

        const genTag = (option: SelectOption): SelectTagWithCollapse => {
            const { label, value } = option;

            let tagLabel: SelectTagWithCollapse['label'] = '';
            if (!isNil(label)) {
                tagLabel = label;
            } else if (!isNil(value)) {
                if (typeof value === 'string' || typeof value === 'number') {
                    tagLabel = value;
                } else {
                    tagLabel = value.toString();
                }
            }

            return {
                ...option,
                label: tagLabel,
                closable: !props.disabled,
            };
        };

        const labelTextRef = computed(() => {
            const options = props.selectedOptions;
            if (options.length) {
                return `${options[0].label ?? options[0].value ?? ''}`;
            }
            return '';
        });

        const multiLabelRef = computed(() => {
            const options = props.selectedOptions;
            const tags: SelectTagWithCollapse[] = [];

            if (props.collapseTags) {
                const showOptions = options.slice(0, props.collapseTagsLimit);
                const rest = options.slice(props.collapseTagsLimit);
                const restCount = rest.length;

                showOptions.forEach((option) => tags.push(genTag(option)));

                if (restCount > 0) {
                    tags.push({
                        isCollapsed: true,
                        collapsedOptions: rest.map(genTag),
                        value: null,
                        label: `+ ${restCount}`,
                        closable: false,
                    });
                }
            } else {
                options.forEach((option) => tags.push(genTag(option)));
            }

            return tags;
        });

        const calcCollapseTagIndex = (collapseTagIndex: number): number =>
            collapseTagIndex + props.collapseTagsLimit;

        const hasTagBordered = computed(() => {
            return props.disabled || props.tagBordered;
        });

        const handleFocus = (event: Event) => {
            if (props.disabled) return;
            isFocusRef.value = true;
            emit('focus', event);
        };

        const handleBlur = (event: Event) => {
            if (props.disabled) return;
            isFocusRef.value = false;
            if (filterTextRef.value) {
                filterTextRef.value = '';
                emit('input', filterTextRef.value, {
                    isClear: true,
                });
            }
            emit('blur', event);
        };

        const handleRemove = (index: number) => {
            if (props.disabled) return;
            emit('remove', props.selectedOptions[index].value);
        };

        const handleClear = () => {
            if (props.disabled) return;
            emit('clear');
        };

        const handleInput = (e: Event) => {
            if (props.disabled || isComposingRef.value) return;
            filterTextRef.value = (e.target as HTMLInputElement).value;
            emit('input', filterTextRef.value);
        };

        const handleCompositionStart = () => {
            isComposingRef.value = true;
            compositionValueRef.value = '';
        };
        const handleCompositionUpdate = (event: Event) => {
            if (isComposingRef.value) {
                compositionValueRef.value = (
                    event.target as HTMLInputElement
                ).value;
            }
        };
        const handleCompositionEnd = (event: Event) => {
            if (isComposingRef.value) {
                compositionValueRef.value = '';
                isComposingRef.value = false;
                handleInput(event);
            }
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
            (val, oldVal) => {
                if (!isEqual(val, oldVal)) {
                    filterTextRef.value = '';
                }
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
            handleCompositionStart,
            handleCompositionUpdate,
            handleCompositionEnd,
            handleInput,
            labelTextRef,
            multiLabelRef,
            calcCollapseTagIndex,
            handleMouseDown,
            isComposingRef,
            compositionValueRef,
            inputWidthRef,
            hasTagBordered,
        };
    },
});
</script>
