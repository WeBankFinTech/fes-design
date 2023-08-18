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
].map((node, index) => ({
    ...node,
    icon: index % 2 === 0 ? '#ff007f' : 'rgb(127, 0, 255)',
}));
</script>

<template>
    <FTimeline :data="data" direction="row" titlePosition="end" />
</template>
