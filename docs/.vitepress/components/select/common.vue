<template>
    <FSelect
        v-model="arr"
        class="select"
        @change="handleChange"
        @scroll="onScroll"
    >
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            :disabled="item.disabled"
        >
            {{ item.label }}
        </FOption>
    </FSelect>
</template>
<script>
import { reactive, ref } from 'vue';

export default {
    setup() {
        const optionList = reactive([
            {
                value: 'HuNan',
                label: '湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南',
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
            console.log('[select.common] [handleChange] value:', value);
        };
        const onScroll = (e) => {
            console.log('[select.common] [onScroll] e:', e);
        };
        return {
            arr,
            optionList,
            handleChange,
            onScroll,
        };
    },
};
</script>
<style scoped>
.select {
    width: 200px;
}
</style>
