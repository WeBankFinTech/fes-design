<template>
    <FForm :labelWidth="160">
        <FFormItem label="展示格式：">
            <FSelect
                v-model="format"
                clearable
                style="width: 200px"
                :options="formatOptions"
            >
            </FSelect>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FDatePicker
            v-model="currentDate"
            class="date-picker"
            :format="format"
            clearable
            @change="change"
        />
        <FDatePicker
            :style="style"
            type="month"
            placeholder="选择月份"
            :format="format"
        />
        <FDatePicker type="year" placeholder="选择年份" :format="format" />
        <FDatePicker type="quarter" placeholder="选择季度" :format="format" />
        <FDatePicker
            v-model="datetime"
            type="datetime"
            :hourStep="2"
            :minuteStep="2"
            :secondStep="2"
            placeholder="时间日期选择"
            :format="format"
        />
    </FSpace>
</template>

<script setup>
import { reactive, ref } from 'vue';

const formatOptions = [
    'yyyy-MM',
    'yyyy-MM-dd',
    'yyyy/MM/dd',
    'yyyy-MM-dd HH:mm:ss',
].map((value) => ({
    value,
    label: value,
}));
const format = ref();

const currentDate = ref(Date.now() + 31 * 24 * 60 * 60 * 1000);
const change = () => {
    console.log('[datePicker.common] [change] currentDate:', currentDate.value);
};

const style = reactive({
    width: '200px',
});

const datetime = ref();
</script>
<style scope>
.date-picker {
    width: 200px;
}
</style>
