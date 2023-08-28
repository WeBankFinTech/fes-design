<template>
    <div :class="prefixCls">
        <div :class="`${prefixCls}-image`" :style="imageStyle">
            <img
                v-if="imageSrc"
                class="empty-img"
                :src="imageSrc"
                ondragstart="return false"
            />
            <slot v-else name="image">
                <DefaultImgEmpty />
            </slot>
        </div>
        <div :class="`${prefixCls}-description`">
            <p v-if="description" class="desc-text">{{ description }}</p>
            <slot v-else name="description">
                <p class="empty-text">{{ defaultDescription }}</p>
            </slot>
        </div>
        <div v-if="$slots.default" :class="`${prefixCls}-bottom`">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';

import { useLocale } from '../config-provider/useLocale';

import DefaultImgEmpty from './imgEmpty.vue';
import { emptyProps } from './props';

export default defineComponent({
    name: 'FEmpty',
    components: {
        DefaultImgEmpty,
    },
    props: emptyProps,
    setup() {
        useTheme();

        const prefixCls = getPrefixCls('empty');

        const { t } = useLocale();
        const defaultDescription = computed(() => t('empty.emptyText'));

        return {
            prefixCls,
            defaultDescription,
        };
    },
});
</script>
