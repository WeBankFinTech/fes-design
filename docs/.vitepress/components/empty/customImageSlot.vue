<template>
    <FEmpty image-style="width: 200px;" description="自定义图片(插槽)">
        <template #image>
            <img :src="url" alt="empty">
        </template>
    </FEmpty>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const url = ref('/images/empty.svg');
</script>
