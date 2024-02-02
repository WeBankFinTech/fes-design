<template>
    <FSpace>
        <FAvatar
            :size="size"
            src="empty.png"
            fallback-src="https://fes-design.mumblefe.cn/images/fes-logo.svg"
            @error="handleError"
        ></FAvatar>
        <FAvatar :size="size" src="empty.png" @error="handleError"></FAvatar>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(32);

const handleError = () => {
    console.log('loading error');
};
</script>
