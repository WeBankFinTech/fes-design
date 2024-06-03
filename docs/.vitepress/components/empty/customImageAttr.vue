<template>
    <FEmpty :image-src="url" :image-style="{ width: '300px' }" description="自定义图片(属性)" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const url = ref('/images/empty.svg');
</script>
