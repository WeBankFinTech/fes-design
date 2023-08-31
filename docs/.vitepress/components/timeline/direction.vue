<template>
    <FRadioGroup
        v-model="direction"
        :options="[
            { label: '垂直向下(默认)', value: 'column' },
            { label: '水平向右', value: 'row' },
            { label: '水平向左', value: 'row-reverse' },
        ]"
        :style="{ marginBottom: 'var(--f-padding-large)' }"
    />
    <FTimeline
        :data="data"
        :direction="direction ?? undefined"
        titlePosition="end"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const data = [
    {
        title: '2015-09-01',
        desc: 'Create a services',
    },
    {
        title: '2015-09-01',
        desc: 'Solve initial network',
    },
    {
        title: '2015-09-01',
        desc: 'Technical',
    },
    {
        title: '2015-09-01',
        desc: 'Network problems being',
        icon: '#ff007f',
    },
];
const direction = ref('row');
</script>
