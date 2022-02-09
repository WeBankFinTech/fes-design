<template>
    <f-table :data="data" bordered>
        <f-table-column
            prop="date"
            label="日期"
            ellipsis
            :width="150"
        ></f-table-column>
        <f-table-column label="配送信息">
            <f-table-column
                prop="name"
                label="姓名"
                :width="150"
            ></f-table-column>
            <f-table-column label="地址">
                <f-table-column
                    prop="province"
                    label="省份"
                    :width="150"
                ></f-table-column>
                <f-table-column prop="city" label="市区" :width="150">
                </f-table-column>
                <f-table-column
                    prop="address"
                    label="地址"
                    :width="500"
                ></f-table-column>
                <f-table-column prop="zip" label="邮编" :width="120">
                </f-table-column>
            </f-table-column>
        </f-table-column>
    </f-table>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const data = Array.from([1, 2, 3], (i) => {
            return {
                date: `2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-2016-05-${
                    i < 10 ? '0' + i : i
                }`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            };
        });
        return {
            data,
        };
    },
});
</script>
