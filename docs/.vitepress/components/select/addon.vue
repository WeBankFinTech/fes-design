<template>
    <FSelect filterable :options="optionList">
        <template #header>
            <div>如果你点开了这个例子</div>
        </template>
        <template #footer>
            <div>可能你需要它</div>
        </template>
    </FSelect>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const TOTAL_COUNT = 20;

const optionList = ref(
    new Array(TOTAL_COUNT)
        .fill(undefined)
        .map((_, index) => ({ value: index + 1, label: index + 1 })),
);
</script>
