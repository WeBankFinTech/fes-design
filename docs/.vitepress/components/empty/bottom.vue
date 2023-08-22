<template>
    <FEmpty :image="url" :image-size="400" description="暂无数据">
        <FButton type="primary">退出登录</FButton>
    </FEmpty>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const url = ref('/images/empty.svg');
</script>
