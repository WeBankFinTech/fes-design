<template>
    <FSpace>
        <FSelect filterable>
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            ></FOption>
        </FSelect>
        <FSelect filterable multiple @blur="blur">
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            ></FOption>
        </FSelect>
    </FSpace>
</template>
<script>
import { reactive } from 'vue';

export default {
    setup() {
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
            {
                value: '1',
                label: '1',
            },
            {
                value: '2',
                label: '2',
            },
            {
                value: '3',
                label: '3',
            },
            {
                value: '4',
                label: '4',
            },
            {
                value: '5',
                label: '5',
            },
            {
                value: '6',
                label: '6',
            },
            {
                value: '7',
                label: '7',
            },
            {
                value: '8',
                label: '8',
            },
        ]);
        const blur = () => {
            console.log('blur');
        };
        return {
            optionList,
            blur,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
