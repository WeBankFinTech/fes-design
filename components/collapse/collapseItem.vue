<template>
    <div :class="rootKls">
        <div
            role="tab"
            :aria-expanded="isActive"
            :aria-controls="scopedContentId"
            :aria-describedby="scopedContentId"
        >
            <div
                :id="scopedHeadId"
                :class="headKls"
                role="button"
                :tabindex="disabled ? -1 : 0"
                @click="handleHeaderClick"
                @keypress.space.enter.stop.prevent="handleEnterClick"
                @focus="handleFocus"
                @blur="focusing = false"
            >
                <div
                    v-if="arrow === 'left'"
                    class="fes-collapse-item__arrow-left"
                    :class="arrowKls"
                >
                    <right-outlined />
                </div>
                <slot name="title">{{ title }}</slot>
                <div v-if="arrow === 'right'" :class="arrowKls">
                    <right-outlined />
                </div>
            </div>
        </div>
        <ColTransition name="fes-fade-in-linear" mode="in-out">
            <div
                v-show="isActive"
                :id="scopedContentId"
                :class="itemWrapperKls"
                role="tabpanel"
                :aria-hidden="!isActive"
                :aria-labelledby="scopedHeadId"
            >
                <div :class="itemContentKls">
                    <slot />
                </div>
            </div>
        </ColTransition>
    </div>
</template>

<script lang="ts" setup>
import { Transition as ColTransition, inject } from 'vue';
import { RightOutlined } from '../icon';
import { collapseItemProps } from './collapseItem';
import { useCollapseItem, useCollapseItemDOM } from './useCollapseItem';
import { arrowPositionKey } from './common';

const props = defineProps(collapseItemProps);

const { arrow } = inject(arrowPositionKey) as any;

const {
    focusing,
    id,
    isActive,
    handleFocus,
    handleHeaderClick,
    handleEnterClick,
} = useCollapseItem(props);

const {
    arrowKls,
    headKls,
    rootKls,
    itemWrapperKls,
    itemContentKls,
    scopedContentId,
    scopedHeadId,
} = useCollapseItemDOM(props, { focusing, isActive, id });
console.log(itemWrapperKls);

defineExpose({
    /** @description current collapse-item whether active */
    isActive,
});
</script>

<script lang="ts">
export default {
    name: 'FCollapseItem',
};
</script>
