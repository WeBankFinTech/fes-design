<script setup lang="ts">
const data = [
    {
        title: '2015-09-01',
    },
    {
        title: '2015-09-01',
    },
    {
        title: '2015-09-01',
    },
    {
        title: '2015-09-01',
        icon: '#ff007f',
    },
];
</script>

<template>
    <FTimeline :data="data" direction="row" descPosition="opposite">
        <template #desc="{ index }">
            <span
                :style="{
                    color:
                        index === data.length - 1
                            ? '#ff007f'
                            : 'var(--f-primary-color)',
                }"
            >
                自定义辅助描述
            </span>
        </template>
    </FTimeline>
</template>
