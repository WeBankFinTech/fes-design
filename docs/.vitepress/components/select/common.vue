<template>
    <FSelect v-model="arr" @change="handleChange">
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            >{{ item.label }}</FOption
        >
    </FSelect>
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
        const handleChange = (value) => {
            console.log('change:', value);
        };
        return {
            arr,
            optionList,
            handleChange,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
