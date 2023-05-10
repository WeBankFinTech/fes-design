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
        <FadeInExpandTransition>
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
        </FadeInExpandTransition>
    </div>
</template>

<script lang="ts">
import { inject, defineComponent } from 'vue';
import FadeInExpandTransition from '../_util/components/fadeInExpandTransition';
import { RightOutlined } from '../icon';
import { useTheme } from '../_theme/useTheme';
import { collapseItemProps } from './collapseItemExpose';
import { useCollapseItem, useCollapseItemDOM } from './useCollapseItem';
import { arrowPositionKey } from './common';
import type { ArrowType } from './common';

export default defineComponent({
    name: 'FCollapseItem',
    components: {
        FadeInExpandTransition,
        RightOutlined,
    },
    props: collapseItemProps,
    setup(props) {
        useTheme();

        const { arrow, embedded } = inject(arrowPositionKey) as ArrowType;
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
        } = useCollapseItemDOM(props, { focusing, isActive, id, embedded });

        return {
            arrow,
            arrowKls,
            headKls,
            rootKls,
            itemWrapperKls,
            itemContentKls,
            scopedContentId,
            scopedHeadId,
            focusing,
            isActive,
            handleFocus,
            handleHeaderClick,
            handleEnterClick,
        };
    },
});
</script>
