<template>
    <div style="position: relative;">
        <div ref="containerRef" class="back-top-container">
            <div class="back-top-content" />
        </div>
        <FBackTop class="back-top-absolute" :target="containerRef" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const containerRef = ref(null);
</script>

<style lang="less">
.back-top-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: scroll;

    .back-top-content {
        width: 100%;
        height: 1200px;
        background-color: var(--f-component-bg-color);
    }
}
.back-top-absolute {
    position: absolute !important;
}
</style>
