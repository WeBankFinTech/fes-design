<template>
    <FTransfer :options="options" :style="{ width: '520px' }">
        <template #label="{ option }">
            <div :style="{ display: 'flex', alignItems: 'center' }">
                <UserManagementOutlined :style="{ marginRight: '4px' }" />
                <span> {{ option.label }}</span>
            </div>
        </template>
    </FTransfer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const options = ref(
    new Array(10)
        .fill(null)
        .map((_, index) => ({ label: `Staff ${index + 1}`, value: index })),
);
</script>
