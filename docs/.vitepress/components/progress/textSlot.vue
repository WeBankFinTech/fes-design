<template>
    <FProgress :percent="percent" showOutPercent>
        <template #text>
            <span class="text">这是自定义文案</span>
        </template>
    </FProgress>
    <FDivider></FDivider>
    <FProgress :percent="percent" type="circle" showCircleText>
        <template #text>
            <div class="text">
                <div>{{ percent }}</div>
                <div>这是自定义文案</div>
            </div>
        </template>
    </FProgress>
</template>

<script setup>
import { ref } from 'vue';

const percent = ref(60);
</script>

<style scoped>
.text {
    color: green;
    font-size: 14px;
    text-align: center;
}
</style>
