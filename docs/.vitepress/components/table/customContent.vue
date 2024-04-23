<template>
    <FTable :data="data">
        <FTableColumn v-slot="{ row }" prop="date" label="日期" :width="150">
            <div class="table-custom-content-date">
                <ClockCircleOutlined /><FEllipsis
                    :content="row.date"
                ></FEllipsis>
            </div>
        </FTableColumn>
        <FTableColumn v-slot="{ row }" prop="name" label="姓名">
            <FTag>{{ row.name }}</FTag>
        </FTableColumn>
        <FTableColumn prop="address" label="地址"></FTableColumn>
        <FTableColumn v-slot="{ row }" label="操作">
            <FButton @click="() => handleClickRow(row)">编辑</FButton>
        </FTableColumn>
    </FTable>

    <FDivider></FDivider>

    <FTable :data="data" :columns="columns"> </FTable>
</template>

<script>
import { h, reactive, defineComponent } from 'vue';
import { ClockCircleOutlined } from '@fesjs/fes-design/icon';
import { FEllipsis, FTag, FButton } from '@fesjs/fes-design';

export default defineComponent({
    comments: {
        ClockCircleOutlined,
    },
    setup() {
        const handleClickRow = (row) => {
            console.log('[table.customContent] [handleClickRow] row:', row);
        };

        const data = reactive(
            Array.from([1, 2], (i) => {
                return {
                    date: `2016-05-2016-05-2016-05-2016-05-${
                        i < 10 ? '0' + i : i
                    }`,
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                };
            }),
        );
        const columns = [
            {
                prop: 'date',
                label: '日期',
                width: 150,
                ellipsis: true,
                render: ({ row }) => {
                    return h('div', { class: 'table-custom-content-date' }, [
                        h(ClockCircleOutlined),
                        h(FEllipsis, {
                            content: row.date,
                        }),
                    ]);
                },
            },
            {
                prop: 'name',
                label: '姓名1',
                render: ({ row }) => {
                    return h(FTag, {}, () => row.name);
                },
            },
            {
                prop: 'name',
                label: '姓名2',
                formatter: ({ row }) => {
                    return h(FTag, {}, () => row.name);
                },
            },
            {
                prop: 'address',
                label: '地址',
                formatter: ({ row }) => {
                    return row.address;
                },
            },
            {
                prop: 'action',
                label: '操作',
                render: ({ row }) => {
                    return h(
                        FButton,
                        { onClick: () => handleClickRow(row) },
                        () => '编辑',
                    );
                },
            },
        ];

        return {
            data,
            columns,
            handleClickRow,
        };
    },
});
</script>

<style>
.table-custom-content-date {
    display: flex;
    align-items: center;
}
</style>
