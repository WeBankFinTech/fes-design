<template>
    <FSpace>
        <FSelect v-model="value1" disabled>
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            ></FOption>
        </FSelect>
        <FSelect v-model="value2" multiple disabled>
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            ></FOption>
        </FSelect>
        <FSelect v-model="value2" multiple disabled collapseTags>
            <FOption
                v-for="(item, index) in optionList"
                :key="index"
                :value="item.value"
                :label="item.label"
            ></FOption>
        </FSelect>
        <FSelect
            v-model="value2"
            multiple
            disabled
            collapseTags
            :collapseTagsLimit="2"
        >
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
import { reactive, ref } from 'vue';

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
        const value1 = ref('HuNan');
        const value2 = ref(['HuNan', 'HuBei', 'ZheJiang', 'GuangDong']);
        return {
            optionList,
            value1,
            value2,
        };
    },
};
</script>
<style scoped>
.fes-select {
    width: 200px;
}
</style>
