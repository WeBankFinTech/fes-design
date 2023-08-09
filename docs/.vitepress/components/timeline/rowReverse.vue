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
        icon: '#ff007f',
    },
];
</script>

<template>
    <FTimeline :data="data" direction="row-reverse" titlePosition="end" />
</template>
