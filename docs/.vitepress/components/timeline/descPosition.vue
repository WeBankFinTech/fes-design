<template>
    <FForm>
        <FFormItem label="direction:">
            <FRadioGroup
                v-model="direction"
                :options="[
                    { label: 'column', value: 'column' },
                    { label: 'row', value: 'row' },
                    { label: 'row-reverse', value: 'row-reverse' },
                ]"
            />
        </FFormItem>
        <FFormItem label="descPosition:">
            <FRadioGroup v-model="descPosition" :options="descConfig" />
        </FFormItem>
    </FForm>
    <FTimeline
        :data="data"
        :direction="direction ?? undefined"
        :descPosition="descPosition ?? undefined"
        titlePosition="start"
        class="timeline"
    />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

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

const descConfig = computed(() => [
    { label: 'under (default)', value: 'under' },
    {
        label: 'inline',
        value: 'inline',
        disabled: direction.value !== 'column',
    },
    { label: 'opposite', value: 'opposite' },
]);
</script>
