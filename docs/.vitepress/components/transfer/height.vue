<template>
    <FForm>
        <FFormItem label="开启过滤">
            <FSwitch v-model="filterable" />
        </FFormItem>
    </FForm>
    <FTransfer
        :options="options"
        :twoWay="false"
        :filterable="filterable"
        :height="400"
        :style="{ width: '520px' }"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const filterable = ref<boolean>(true);

const options = ref(
    new Array(50)
        .fill(null)
        .map((_, index) => ({ label: `Option ${index + 1}`, value: index })),
);
</script>
