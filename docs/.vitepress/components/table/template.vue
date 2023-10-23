<template>
    <FTable :data="data">
        <FTableColumn v-slot="{ row }" prop="date" label="日期">
            <div style="display: flex; align-items: center">
                <ClockCircleOutlined />{{ row.date }}
            </div>
        </FTableColumn>
        <FTableColumn v-slot="{ row }" prop="name" label="姓名">
            <FTag>{{ row.name }}</FTag>
        </FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
        <FTableColumn label="操作">
            <FButton>编辑</FButton>
        </FTableColumn>
    </FTable>
</template>
<script>
import { reactive } from 'vue';
export default {
    setup() {
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
                return {
                    date: `2016-05-${i < 10 ? '0' + i : i}`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        return {
            data,
        };
    },
};
</script>
