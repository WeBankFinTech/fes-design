<template>
    <div :class="prefixCls">
        <div :class="`${prefixCls}-image`" :style="imageStyle">
            <img v-if="imageSrc" :src="imageSrc" ondragstart="return false" />
            <slot v-else name="image">
                <DefaultImgEmpty />
            </slot>
        </div>
        <div :class="`${prefixCls}-description`">
            <slot v-if="$slots.description" name="description" />
            <p v-else>{{ emptyDescription }}</p>
        </div>
        <div v-if="$slots.default" :class="`${prefixCls}-bottom`">
            <slot />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';

import { useLocale } from '../config-provider/useLocale';

import DefaultImgEmpty from './imgEmpty.vue';
import { emptyProps } from './props';
import type { CSSProperties } from 'vue';

const prefixCls = getPrefixCls('empty');

defineOptions({
    name: 'FEmpty',
});

const props = defineProps(emptyProps);

useTheme();

const { t } = useLocale();
const emptyDescription = computed(
    () => props.description || t('empty.emptyText'),
);

const imageStyle = computed<CSSProperties>(() => props.imageStyle);
</script>
