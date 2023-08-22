<template>
    <FEmpty :image="url" :image-size="80" description="自定义图片" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const url = ref('/images/empty-simple.svg');
</script>
