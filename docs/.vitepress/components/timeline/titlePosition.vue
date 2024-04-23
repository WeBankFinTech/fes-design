<template>
    <FForm>
        <FFormItem label="时间轴方向:">
            <FRadioGroup
                v-model="direction"
                :options="[
                    { label: '垂直向下(默认)', value: 'column' },
                    { label: '水平向右', value: 'row' },
                    { label: '水平向左', value: 'row-reverse' },
                ]"
            />
        </FFormItem>
        <FFormItem label="标题位置:">
            <FRadioGroup
                v-model="titlePosition"
                :options="titlePositionOptions"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FTimeline
        :data="data"
        :direction="direction ?? undefined"
        :titlePosition="titlePosition ?? undefined"
        :style="{ marginTop: 'var(--f-padding-large)' }"
    />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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

const direction = ref('row');
const titlePosition = ref('end');

const titlePositionOptions = computed(() => {
    if (direction.value === 'column') {
        return [
            { label: '轴的左侧', value: 'start' },
            { label: '轴的右侧(默认)', value: 'end' },
            { label: '左右交叉', value: 'alternate' },
        ];
    } else {
        return [
            { label: '轴的上方', value: 'start' },
            { label: '轴的下方(默认)', value: 'end' },
            { label: '上下交叉', value: 'alternate' },
        ];
    }
});
</script>
