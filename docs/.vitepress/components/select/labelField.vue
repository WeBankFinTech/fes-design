<template>
    <FSelect :options="optionList" optionLabelField="x"></FSelect>
</template>
<script>
import { reactive } from 'vue';

export default {
    setup() {
        const optionList = reactive([
            {
                value: 'HuNan',
                label: '湖南',
                x: 'HuNan-湖南',
            },
            {
                value: 'HuBei',
                label: '湖北',
                disabled: true,
                x: 'HuBei-湖北',
            },
            {
                value: 'ZheJiang',
                label: '浙江',
                x: 'ZheJiang-浙江',
            },
            {
                value: 'GuangDong',
                label: '广东',
                x: 'GuangDong-广东',
            },
            {
                value: 'JiangSu',
                label: '江苏',
                x: 'JiangSu-江苏',
            },
        ]);
        return {
            optionList,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
