<template>
    <FTree :data="data" virtualList checkable cascade></FTree>
</template>
<script>
import { reactive } from 'vue';

function createData(level = 4, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 15 - level }).map((_, index) => {
        const key = `${baseKey}_${index}`;
        return {
            label: createLabel(level, index),
            value: key,
            children: createData(level - 1, key),
        };
    });
}

function createLabel(level, index) {
    if (level === 4) return '道生一_' + index;
    if (level === 3) return '一生二_' + index;
    if (level === 2) return '二生三_' + index;
    if (level === 1) return '三生万物_' + index;
}

export default {
    setup() {
        const data = reactive(createData());
        return {
            data,
        };
    },
};
</script>
<style scoped>
.fes-tree {
    height: 300px;
}
</style>
