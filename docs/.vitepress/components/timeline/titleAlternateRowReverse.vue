<script setup lang="ts">
const data = [
    {
        title: '2015-09-01',
        desc: 'Create a services',
    },
    {
        title: '2015-09-01',
        desc: 'Solve initial network',
        icon: '#ff007f',
    },
    {
        title: '2015-09-01',
        desc: 'Technical Technical Technical Technical Technical Technical',
    },
    {
        title: '2015-09-01',
        desc: 'Network',
    },
];
</script>

<template>
    <FTimeline :data="data" direction="row-reverse" titlePosition="alternate" />
</template>
