<template>
    <FEmpty :image-src="url" description="自定义图片" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const url = ref('/images/empty.svg');
</script>
