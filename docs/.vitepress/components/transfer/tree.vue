<template>
    <FTransfer :options="options" :style="{ width: '520px' }" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const LABEL_MAP = [undefined, '三生万物', '二生三', '一生二', '道生一'];

const createData = (level = 1, prefix = '') => {
    if (!level) return undefined;
    return new Array(2).fill(null).map((_, index) => {
        const key = [prefix, level, index].join('');
        return {
            label: LABEL_MAP[level],
            value: key,
            children: createData(level - 1, key),
            checkable: level % 2 !== 0,
        };
    });
};

const options = ref(createData(4));
</script>
