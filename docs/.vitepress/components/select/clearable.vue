<template>
    <FSelect clearable>
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            :label="item.label"
        />
    </FSelect>
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
