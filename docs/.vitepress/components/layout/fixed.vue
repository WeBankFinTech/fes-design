<template>
    <f-layout style="height: 400px">
        <f-header bordered fixed> Header </f-header>
        <f-layout fixed style="top: 54px; bottom: 70px">
            <f-aside> Aside </f-aside>
            <f-main>
                <f-table :data="data">
                    <f-table-column
                        prop="date"
                        label="日期"
                        :width="150"
                        ellipsis
                        fixed
                    >
                    </f-table-column>
                    <f-table-column
                        prop="name"
                        label="姓名"
                        :width="150"
                    ></f-table-column>
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
                        :width="800"
                    ></f-table-column>
                    <f-table-column prop="zip" label="邮编" :width="120">
                    </f-table-column>
                    <f-table-column
                        label="操作"
                        align="center"
                        :width="200"
                        :action="action"
                        fixed="right"
                    ></f-table-column>
                </f-table>
            </f-main>
        </f-layout>
        <f-footer fixed bordered class="demo-tal">
            We Design ©2018 Created by MumbleFE
        </f-footer>
    </f-layout>
</template>
<script>
import { reactive } from 'vue';
export default {
    setup() {
        const data = reactive(
            Array.from([1, 2, 3], (i) => {
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
            }),
        );
        const action = [
            {
                label: '编辑',
                func: (row) => {
                    console.log('[layout.fixed] [action.编辑] row:', row);
                },
            },
            {
                label: '删除',
                func: (row) => {
                    console.log('[layout.fixed] [action.删除] row:', row);
                },
            },
        ];
        return {
            data,
            action,
        };
    },
};
</script>
<style scoped>
.fes-layout-main {
    min-height: 500px;
    padding: 24px;
}
.fes-layout-footer {
    text-align: center;
    padding: 16px;
}
</style>
