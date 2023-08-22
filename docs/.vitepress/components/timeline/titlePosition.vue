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
        <FFormItem label="titlePosition:">
            <FRadioGroup
                v-model="titlePosition"
                :options="[
                    { label: 'start', value: 'start' },
                    { label: 'end (default)', value: 'end' },
                    { label: 'alternate', value: 'alternate' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FTimeline
        :data="data"
        :direction="direction ?? undefined"
        :titlePosition="titlePosition ?? undefined"
        :style="{ marginTop: 'var(--f-padding-large)' }"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
</script>
