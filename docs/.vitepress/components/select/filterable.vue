<template>
    <FSpace>
        <div>
            默认：
            <FSelect filterable clearable :options="optionList" />
        </div>

        <div>
            自定义过滤函数：
            <FSelect filterable :filter="filter" :options="optionList" />
        </div>
    </FSpace>
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {
        const optionList = reactive([
            {
                value: 'HuNan',
                label: '湖南',
            },
            {
                value: 'HuBei',
                label: '湖北',
                disabled: true,
            },
            {
                value: 'ZheJiang',
                label: '浙江',
            },
            {
                value: 'GuangDong',
                label: '广东',
            },
            {
                value: 'JiangSu',
                label: '江苏',
            },
        ]);
        const filter = (text, option) => {
            return option.label.indexOf(text) !== -1;
        };
        return {
            optionList,
            filter,
        };
    },
};
</script>

<style scoped>
.fes-select {
    width: 200px;
}
</style>
