<template>
    <div ref="demoRoot" class="dark-demo-root">
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
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 演示作用域：变量只注入 demo 自身容器，避免污染文档站整站
const demoRoot = ref(null);
const getContainer = () => demoRoot.value || document.body;
const options = ref([
    { value: '1', label: '选项一' },
    { value: '2', label: '选项二' },
]);
</script>

<style scoped>
.dark-demo-root {
    padding: 16px;
    background-color: var(--f-body-bg-color);
    border-radius: 4px;
}
.dark-demo-body {
    margin: -16px;
    padding: 16px;
}
</style>
