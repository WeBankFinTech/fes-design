<template>
    <FConfigProvider theme="dark" :getContainer="getContainer">
        <div class="dark-demo-body">
            <FSpace vertical>
                <FButton type="primary">主要按钮</FButton>
                <FButton>默认按钮</FButton>
                <FInput placeholder="暗色输入框" style="width: 200px" />
                <FSelect :options="options" style="width: 200px" placeholder="暗色选择器" />
                <FSwitch />
            </FSpace>
        </div>
    </FConfigProvider>
</template>

<script setup>
import { ref } from 'vue';

const getContainer = () => document.body;
const options = ref([
    { value: '1', label: '选项一' },
    { value: '2', label: '选项二' },
]);
</script>

<style scoped>
.dark-demo-body {
    padding: 16px;
    background-color: var(--f-body-bg-color);
    border-radius: 4px;
}
</style>
