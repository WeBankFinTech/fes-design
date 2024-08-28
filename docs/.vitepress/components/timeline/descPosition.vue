<template>
    <FForm>
        <FFormItem label="轴的方向:">
            <FRadioGroup
                v-model="direction"
                :options="[
                    { label: '垂直向下(默认)', value: 'column' },
                    { label: '水平向右', value: 'row' },
                    { label: '水平向左', value: 'row-reverse' },
                ]"
            />
        </FFormItem>
        <FFormItem label="辅助描述位置:">
            <FRadioGroup
                v-model="descPosition"
                :options="descPositionOptions"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FTimeline
        :data="data"
        :direction="direction ?? undefined"
        :descPosition="descPosition ?? undefined"
        titlePosition="start"
        class="timeline"
    >
        <template #title="{ index }">
            <span style="width: 200px;">
                自定义标题 {{ index }}
            </span>
        </template>
    </FTimeline>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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
        icon: '#ff007f',
    },
];

const direction = ref('column');
const descPosition = ref('opposite');

const descPositionOptions = computed(() => {
    return [
        { label: '在标题下方(默认)', value: 'under' },
        {
            label: '与标题同行',
            value: 'inline',
            disabled: direction.value !== 'column',
        },
        { label: '和标题位于轴的两侧', value: 'opposite' },
    ];
});

watch(direction, () => {
    if (direction.value !== 'column' && descPosition.value === 'inline') {
        descPosition.value = 'under';
    }
});
</script>
