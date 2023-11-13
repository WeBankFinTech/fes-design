<template>
    <FRadioGroup
        v-model="splitLineVisible"
        :options="[
            { label: '展示(默认)', value: true },
            { label: '不展示', value: false },
        ]"
    />

    <FDivider></FDivider>

    <FCalendar
        :splitLine="splitLineVisible"
        :shortcuts="[
            {
                label: '今天',
                time: Date.now(),
            },
            {
                label: '星期三',
                time: () => {
                    const today = new Date();
                    const kingDay = new Date();
                    kingDay.setDate(today.getDate() + (3 - today.getDay()));
                    return kingDay.getTime();
                },
            },
        ]"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const splitLineVisible = ref<boolean>(false);
</script>
