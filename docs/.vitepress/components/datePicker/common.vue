<template>
    <Space>
        <FDatePicker v-model="currentDate" clearable />
        <FDatePicker type="month" placeholder="选择月份" />
        <FDatePicker type="year" placeholder="选择年份" />
        <FDatePicker type="quarter" placeholder="选择季度" />
        <FDatePicker type="datetime" placeholder="时间日期选择" />
    </Space>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const currentDate = ref(Date.now());

        return {
            currentDate
        }
    },
})
</script>
