<template>
    <Space>
        <FDatePicker
            v-model="currentDate"
            format="yyyy/MM/dd"
            clearable
            @change="change"
        />
        <FDatePicker type="month" placeholder="选择月份" />
        <FDatePicker type="year" placeholder="选择年份" />
        <FDatePicker type="quarter" placeholder="选择季度" />
        <FDatePicker
            type="datetime"
            :hourStep="2"
            :minuteStep="2"
            :secondStep="2"
            placeholder="时间日期选择"
        />
    </Space>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const currentDate = ref(Date.now() + 31 * 24 * 60 * 60 * 1000);
        const change = () => {
            console.log('change:', currentDate.value);
        };

        return {
            currentDate,
            change,
        };
    },
});
</script>
