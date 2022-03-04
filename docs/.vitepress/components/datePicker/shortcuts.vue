<template>
    <Space>
        <FDatePicker
            v-model="currentDate"
            :shortcuts="shortcuts"
            clearable
            @change="change"
        />
        <FDatePicker
            type="datetime"
            :shortcuts="shortcuts"
            placeholder="时间日期选择"
        />
        <FDatePicker :shortcuts="rangeShortcuts" type="datetimerange" />
    </Space>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const currentDate = ref();
        const change = () => {
            console.log('change:', currentDate.value);
        };
        return {
            currentDate,
            change,
            shortcuts: {
                快乐日: Date.now() + 24 * 60 * 60 * 1000,
                开心日: Date.now(),
                昨天: () => new Date().getTime() - 24 * 60 * 60 * 1000,
            },
            rangeShortcuts: {
                快乐假期: [1629216000000, 1631203200000],
                近2小时: () => {
                    const cur = new Date().getTime();
                    return [cur - 2 * 60 * 60 * 1000, cur];
                },
            },
        };
    },
});
</script>
