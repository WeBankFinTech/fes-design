<template>
    <FTable :data="data">
        <FTableColumn prop="date" label="日期" ellipsis :width="150">
            <template #header>
                <div class="table-custom-header-date">
                    <ClockCircleOutlined /> <span>日期</span>
                </div>
            </template>
        </FTableColumn>
        <FTableColumn prop="name" label="姓名" :width="150"></FTableColumn>
        <FTableColumn prop="province" label="省份" :width="150"></FTableColumn>
        <FTableColumn prop="city" label="市区" :width="150"> </FTableColumn>
        <FTableColumn prop="address" label="地址" :width="800"></FTableColumn>
        <FTableColumn prop="zip" label="邮编" :width="120"> </FTableColumn>
    </FTable>

    <FDivider></FDivider>

    <FTable :data="data" :columns="columns"> </FTable>
</template>
<script>
import { defineComponent, h } from 'vue';
import { ClockCircleOutlined } from '@fesjs/fes-design/icon';

export default defineComponent({
    comments: {
        ClockCircleOutlined,
    },
    setup() {
        const data = Array.from([1, 2], (i) => {
            return {
                date: `2016-05-2016-05-2016-05-2016-05-${i < 10 ? `0${i}` : i}`,
                name: '王小虎',
                province: '上海',
                city: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333,
            };
        });

        const columns = [
            {
                prop: 'date',
                label: '日期',
                width: 150,
                ellipsis: true,
                renderHeader: () => {
                    return h('div', { class: 'table-custom-header-date' }, [
                        h(ClockCircleOutlined),
                        h('span', '日期'),
                    ]);
                },
            },
            {
                prop: 'name',
                label: '姓名',
                width: 150,
            },
            {
                prop: 'province',
                label: '省份',
                width: 150,
            },
            {
                prop: 'city',
                label: '市区',
                width: 150,
            },
            {
                prop: 'address',
                label: '地址',
                width: 800,
            },
            {
                prop: 'zip',
                label: '邮编',
                width: 120,
            },
        ];
        return {
            data,
            columns,
        };
    },
});
</script>
<style>
.table-custom-header-date {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
