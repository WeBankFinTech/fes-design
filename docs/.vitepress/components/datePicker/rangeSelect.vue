<template>
    <FSpace vertical>
        <FDatePicker type="daterange" clearable />
        <FDatePicker
            type="daterange"
            :modelValue="[Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000]"
        >
            <template #separator> 至 </template>
        </FDatePicker>
        <FDatePicker
            v-model="dateTimeRange"
            type="datetimerange"
            :defaultTime="['00:00:00', '23:59:59']"
            clearable
        />
    </FSpace>
</template>

<script>
import { ref } from 'vue'
export default {
    setup() {
        const dateTimeRange = ref([Date.now(), new Date().setHours(32)]);
        return {
            dateTimeRange
        }
    },
}
</script>
