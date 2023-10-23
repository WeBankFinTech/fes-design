<template>
    <FTable :data="data" bordered verticalLine>
        <FTableColumn
            prop="date"
            label="日期"
            :ellipsis="{ tooltip: { popperClass: 'a', showAfter: 500 } }"
            :width="150"
        ></FTableColumn>
        <FTableColumn label="配送信息">
            <FTableColumn prop="name" label="姓名" :width="150"></FTableColumn>
            <FTableColumn label="地址信息">
                <FTableColumn
                    prop="province"
                    label="省份"
                    :width="150"
                ></FTableColumn>
                <FTableColumn prop="city" label="市区" :width="150">
                </FTableColumn>
                <FTableColumn
                    prop="address"
                    label="详细地址"
                    :width="500"
                ></FTableColumn>
                <FTableColumn prop="zip" label="邮编" :width="120">
                </FTableColumn>
            </FTableColumn>
        </FTableColumn>
    </FTable>
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
