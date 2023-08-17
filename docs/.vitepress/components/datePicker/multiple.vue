<template>
    <FSpace vertical>
        <FDatePicker
            v-model="multipleDate"
            type="datemultiple"
            clearable
            @change="changeMultipleData"
        />
        <FDatePicker
            v-model="multipleDate"
            type="datemultiple"
            format="yyyy/MM/dd"
            @change="changeMultipleData"
        />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';
const multipleDate = ref([]);
const changeMultipleData = () => {
    console.log(
        '[datePicker.multiple] [changeMultipleData] multipleDate:',
        multipleDate.value,
    );
};
</script>
<style scope>
.date-picker-1 {
    width: 320px;
}
</style>
