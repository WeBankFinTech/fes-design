<template>
    <FSpace vertical>
        <FDatePicker
            class="date-picker"
            type="datetime"
            :hourStep="2"
            :minuteStep="2"
            :secondStep="2"
            placeholder="时间日期选择"
            defaultTime="08:00:00"
            clearable
        />
        <FDatePicker
            type="datetimerange"
            clearable
            :defaultTime="['08:00:00', '20:00:00']"
        />
    </FSpace>
</template>

<script setup></script>

<style scope>
.date-picker {
    width: 320px;
}
</style>
