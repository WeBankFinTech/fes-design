<template>
    <FSpace vertical>
        <FText type="secondary">
            列配置 ellipsis 支持 boolean 与对象（参考 Ellipsis 组件配置），文本溢出省略号展示。
        </FText>
        <FTable
            rowKey="id"
            :data="data"
            :columns="columns"
            width="100%"
            height="auto"
            layout="fixed"
            bordered
        />
    </FSpace>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const data = [
            {
                id: 1,
                name: '上海市普陀区金沙江路 1518 弄 2 号（加班时间长、通勤距离远的长文本演示）',
                desc: '这是一段很长的描述文本，用于演示单元格文本超出列宽时的省略号效果，配合 ellipsis 对象配置可实现自定义行数与更多控制。',
            },
            {
                id: 2,
                name: '北京市朝阳区望京 SOHO（同样为长文本，触发单行省略）',
                desc: '演示 ellipsis 传对象时列配置不受渲染写入影响，任意多行文本均稳定省略展示。',
            },
        ];
        const columns = [
            {
                prop: 'id',
                label: 'ID',
                width: 60,
                ellipsis: true,
            },
            {
                prop: 'name',
                label: '名称（ellipsis 对象，单行）',
                width: 300,
                ellipsis: { line: 1 },
            },
            {
                prop: 'desc',
                label: '描述（ellipsis 对象，maxLines 3 + 提示）',
                width: 320,
                ellipsis: { line: 3, expandable: true },
            },
        ];
        return {
            data,
            columns,
        };
    },
});
</script>
