<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
    { title: '2018' },
    { title: '2019' },
    { title: '2020' },
    { title: '2021' },
    { title: '2022' },
    { title: '2023' },
]);

const customNodes = ref(new Set<string>(['2018', '2022', '2023']));

const handleTrigger = (index: number) => {
    const title = data.value[index].title;
    customNodes.value.has(title)
        ? customNodes.value.delete(title)
        : customNodes.value.add(title);
};

const handleDelete = (index: number) => {
    customNodes.value.delete(data.value[index].title);
    data.value.splice(index, 1);
};
</script>

<template>
    <FTimeline :data="data" direction="row">
        <template #icon="{ index }">
            <RightCircleOutlined
                v-if="customNodes.has(data[index]?.title)"
                :size="16"
                color="#7f00ff"
            />
        </template>
        <template #desc="{ index }">
            <RotateLeftOutlined class="btn" @click="handleTrigger(index)" />
            <DeleteOutlined class="btn" @click="handleDelete(index)" />
        </template>
    </FTimeline>
</template>

<style scoped lang="less">
.btn {
    cursor: pointer;
    opacity: 0;

    &:hover {
        opacity: 1;
    }
}
</style>
