<template>
    <FSpace vertical>
        <FSwitch v-model="show" class="demo-switch">
            <template #active> 开 </template>
            <template #inactive> 关 </template>
        </FSwitch>
        <FSpin
            :show="show"
            :delay="200"
            style="width: 100%"
            description="加载中"
        >
            <f-table :data="data">
                <f-table-column prop="date" label="日期"></f-table-column>
                <f-table-column prop="name" label="姓名"></f-table-column>
                <f-table-column prop="address" label="地址"></f-table-column>
            </f-table>
        </FSpin>
    </FSpace>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
    setup() {
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王大虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        const show = ref(false);
        return {
            data,
            show,
        };
    },
};
</script>
