<template>
    <FSpace>
        <FSelect class="select" tag filterable :options="optionList"> </FSelect>

        <FSelect class="select" tag filterable multiple :options="optionList">
        </FSelect>
    </FSpace>
</template>
<script>
import { reactive, ref } from 'vue';

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
        const arr = ref();

        return {
            arr,
            optionList,
        };
    },
};
</script>
<style scoped>
.select {
    width: 200px;
}
</style>
