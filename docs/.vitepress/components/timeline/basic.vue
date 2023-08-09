<script setup lang="ts">
const data = [
    {
        title: '2015-09-01',
        desc: 'Create a services site',
    },
    {
        title: '2015-09-01',
        desc: 'Solve initial network problems',
    },
    {
        title: '2015-09-01',
        desc: 'Technical testing',
    },
    {
        title: '2015-09-01',
        desc: 'Network problems being solved',
    },
];
</script>

<template>
    <FTimeline :data="data" />
</template>
