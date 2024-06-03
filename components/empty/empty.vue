<template>
    <div :class="prefixCls">
        <div :class="`${prefixCls}-image`" :style="imageStyle">
            <slot v-if="$slots.image" name="image" />
            <img
                v-else-if="imageSrc"
                class="empty-img"
                :src="imageSrc"
                ondragstart="return false"
            >
            <DefaultImgEmpty v-else />
        </div>
        <div :class="`${prefixCls}-description`">
            <slot v-if="$slots.description" name="description" />
            <p v-else-if="description">{{ description }}</p>
            <p v-else>{{ defaultDescription }}</p>
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
