<template>
    <div class="text-tips">不折叠选中项（默认）：</div>
    <FSelect multiple clearable>
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            :label="item.label"
        ></FOption>
    </FSelect>
    <div class="text-tips">折叠选中项：</div>
    <FSelect multiple clearable collapseTags>
        <FOption
            v-for="(item, index) in optionList"
            :key="index"
            :value="item.value"
            :label="item.label"
        ></FOption>
    </FSelect>
</template>
<script>
import { reactive } from 'vue';

export default {
    setup() {
        const optionList = reactive([
            {
                value: 'HuNan',
                label: '湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南湖南'
            },
            {
                value: 'HuBei',
                label: '湖北',
                disabled: true
            },
            {
                value: 'ZheJiang',
                label: '浙江'
            },
            {
                value: 'GuangDong',
                label: '广东'
            },
            {
                value: 'JiangSu',
                label: '江苏'
            }
        ]);
        return {
            optionList
        };
    }
};
</script>
<style lang="less" scoped>
.fes-select {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
