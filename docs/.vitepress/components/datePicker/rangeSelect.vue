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
            :format="format"
            class="date-picker"
            type="daterange"
            clearable
        />
        <FDatePicker
            :format="format"
            class="date-picker"
            type="datemonthrange"
        />
        <FDatePicker
            :format="format"
            type="daterange"
            style="width: 320px"
            :modelValue="[Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000]"
            clearable
        >
            <template #separator> 至 </template>
        </FDatePicker>
        <FDatePicker
            v-model="dateTimeRange"
            :format="format"
            type="datetimerange"
            clearable
        />
    </FSpace>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const formatOptions = [
            'yyyy-MM-dd',
            'yyyy/MM/dd',
            'yyyy-MM-dd HH:mm:ss',
            'yyyy-MM',
        ].map((value) => ({
            value,
            label: value,
        }));
        const format = ref();

        const dateTimeRange = ref([Date.now(), new Date().setHours(32)]);

        return {
            formatOptions,
            format,

            dateTimeRange,
        };
    },
};
</script>
<style scope>
.date-picker {
    width: 320px;
}
</style>
