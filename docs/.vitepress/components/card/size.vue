<template>
    <FRadioGroup v-model="size">
        <FRadio value="small">small</FRadio>
        <FRadio value="middle">middle(默认)</FRadio>
        <FRadio value="large">large</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <div class="card-wrapper">
        <FCard header="这里是标题" :size="size">
            卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
        </FCard>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const size = ref('middle');
</script>

<style scoped>
.card-wrapper {
    width: 350px;
}
</style>
