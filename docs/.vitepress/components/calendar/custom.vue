<template>
    <FCalendar
        :shortcuts="[
            {
                label: '今天',
                time: Date.now(),
            },
        ]"
    >
        <template #cellMain="{ date, mode }">
            <FTag
                v-if="mode === 'date' && isKingDay(date)"
                size="small"
                type="warning"
                effect="dark"
            >
                1+1
            </FTag>
        </template>
        <template #cellAppendant="{ date, mode }">
            <div v-if="mode === 'date'" :style="{ padding: '8px 0' }">
                <FTag v-if="isKingDay(date)" size="small" type="warning">
                    星期三
                </FTag>
                <FTag v-if="isCrazyDay(date)" size="small" type="danger">
                    星期四
                </FTag>
            </div>
        </template>
    </FCalendar>
</template>

<script setup lang="ts">
const today = new Date();

const crazyDay = new Date();
crazyDay.setDate(today.getDate() + (4 - today.getDay()));
const isCrazyDay = (d: number): boolean => {
    const _d = new Date(d);
    return (
        _d.getFullYear() === crazyDay.getFullYear()
        && _d.getMonth() === crazyDay.getMonth()
        && _d.getDate() === crazyDay.getDate()
    );
};

const kingDay = new Date();
kingDay.setDate(today.getDate() + (3 - today.getDay()));
const isKingDay = (d: number): boolean => {
    const _d = new Date(d);
    return (
        _d.getFullYear() === kingDay.getFullYear()
        && _d.getMonth() === kingDay.getMonth()
        && _d.getDate() === kingDay.getDate()
    );
};
</script>
