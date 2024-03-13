<template>
    <FSpace vertical>
        <FTransfer
            filterable
            :options="options1"
            :style="{ width: '520px', height: '502px' }"
        />
        <FTransfer
            twoWay
            filterable
            :options="options2"
            :style="{ width: '520px', height: '502px' }"
        />
    </FSpace>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const createOptions = (num = 12) =>
    new Array(num)
        .fill(null)
        .map((_, index) => ({ label: `Option ${index + 1}`, value: index }));

const options1 = ref(createOptions());
const options2 = ref(createOptions());
</script>
