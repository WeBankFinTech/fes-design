<script setup lang="ts">
const data = [
    {
        title: '2015-09-01',
        desc: 'Create a services',
    },
    {
        title: '2015-09-01',
        desc: 'Solve initial network',
        icon: 'error',
    },
    {
        title: '2015-09-01',
        desc: 'Technical',
        icon: 'success',
    },
    {
        title: '2015-09-01',
        desc: 'Network problems being',
        icon: 'warning',
    },
];
</script>

<template>
    <FTimeline :data="data" direction="row-reverse" titlePosition="start" />
</template>
