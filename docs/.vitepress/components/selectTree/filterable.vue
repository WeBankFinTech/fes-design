<template>
    <FSpace>
        <div>
            默认：
            <FSelectTree :data="data" filterable virtualList></FSelectTree>
        </div>

        <div>
            自定义过滤函数：
            <FSelectTree
                :data="data"
                filterable
                :filter="filter"
                virtualList
            ></FSelectTree>
        </div>
    </FSpace>
</template>
<script>
import { reactive } from 'vue';

function createData(level = 4, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 10 - level }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key),
        };
    });
}

function createLabel(level) {
    if (level === 4) return '道生一';
    if (level === 3) return '一生二';
    if (level === 2) return '二生三';
    if (level === 1) return '三生万物';
}

export default {
    setup() {
        const data = reactive(createData(4));
        const filter = (text, option) => {
            return option.label.indexOf(text) !== -1;
        };
        return {
            data,
            filter,
        };
    },
};
</script>
<style scoped>
.fes-select-tree {
    width: 200px;
}
</style>
