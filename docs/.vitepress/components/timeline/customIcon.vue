<script setup lang="ts">
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
    },
];
</script>

<template>
    <FTimeline
        :data="data"
        direction="row"
        titlePosition="start"
        descPosition="opposite"
    >
        <template #icon="{ index }">
            <CheckCircleOutlined
                v-if="index === data.length - 1"
                :size="16"
                color="#7f00ff"
            />
        </template>
    </FTimeline>
</template>
