<template>
    <FSpace vertical>
        <FSelect :modelValue="singleSelect" :passive="false" @change="changeSingle">
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            />
        </FSelect>
    </FSpace>
</template>

<script setup>
import { reactive, ref } from 'vue';

const optionList = reactive([
    {
        value: 'HuNan',
        label: '湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南',
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

const singleSelect = ref();
function changeSingle(value) {
    console.log(value);
    singleSelect.value = value;
}
</script>

<style scoped>
.fes-select {
    width: 200px;
}
</style>
