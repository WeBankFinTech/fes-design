<template>
    <FButton @click="show = true">没有遮罩</FButton>
    <FDrawer
        v-model:show="show"
        title="没有遮罩"
        :mask="false"
        :operable="true"
        @ok="show = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(false);
</script>
