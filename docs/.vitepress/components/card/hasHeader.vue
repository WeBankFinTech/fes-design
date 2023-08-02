<template>
    <FRadioGroup v-model="showHeader">
        <FRadio :value="true">有标题</FRadio>
        <FRadio :value="false">无标题</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <div class="card-wrapper">
        <FCard :header="showHeader ? '这里是标题' : ''">
            卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
        </FCard>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const showHeader = ref(true);
</script>

<style scoped>
.card-wrapper {
    width: 350px;
}
</style>
