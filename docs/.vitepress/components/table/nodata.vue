<template>
    <f-table :data="data">
        <f-table-column prop="date" label="日期"></f-table-column>
        <f-table-column prop="name" label="姓名"></f-table-column>
        <f-table-column prop="address" label="地址"></f-table-column>
    </f-table>
</template>
<script>
import { reactive } from 'vue';
export default {
    setup() {
        const data = reactive([]);
        return {
            data,
        };
    },
};
</script>
