<template>
    <FRadioGroup v-model="divider">
        <FRadio :value="true">有分割线(默认)</FRadio>
        <FRadio :value="false">无分割线</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <div class="card-wrapper">
        <FCard header="这里是标题" :divider="divider">
            卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
        </FCard>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const divider = ref(true);
</script>

<style scoped>
.card-wrapper {
    width: 350px;
}
</style>
