<template>
    <FTimeline :data="data2" direction="row" descPosition="opposite">
        <template #desc="{ index }">
            <span
                :style="{
                    color:
                        index === data2.length - 1
                            ? '#ff007f'
                            : 'var(--f-primary-color)',
                }"
            >
                自定义辅助描述
            </span>
        </template>
        <template #title="{ index, item }">
            <span
                :style="{
                    color:
                        index === data2.length - 1
                            ? '#ff007f'
                            : 'var(--f-primary-color)',
                }"
            >
                {{ item.title }}
            </span>
        </template>
    </FTimeline>
    <FDivider />
    <FTimeline :data="data1">
        <template #desc="{ item }">
            <div class="desc">{{ item.desc }}</div>
        </template>
    </FTimeline>
</template>

<script setup lang="ts">
const data1 = [
    {
        title: '2015-09-01',
        desc: 'Create a services site',
    },
    {
        title: '2015-09-01',
        desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    },
    {
        title: '2015-09-01',
        desc: '当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点，当 pending 为真值时展示幽灵节点，如果 pending 是 React 元素可用于定制该节点内容，同时 pendingDot 将可以用于定制其轴点。reverse 属性用于控制节点排序，为 false 时按正序排列，为 true 时按倒序排列。',
    },
    {
        title: '2015-09-01',
        desc: 'Network problems being solved',
        icon: '#ff007f',
    },
];

const data2 = [
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

<style scoped>
.desc {
    width: 300px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid var(--f-border-color-disabled);
}
</style>
