<template>
    <FCascader
        v-model:selectedKeys="selectedKeys"
        v-model:expandedKeys="expandedKeys"
        v-model:checkedKeys="checkedKeys"
        :data="data"
        checkable
    ></FCascader>
</template>
<script>
import { ref, reactive } from 'vue';

function createData(level = 1, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
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
        const selectedKeys = ref(['4031']);
        const expandedKeys = ref(['40']);
        const checkedKeys = ref(['40']);

        return {
            data,
            selectedKeys,
            expandedKeys,
            checkedKeys,
        };
    },
};
</script>
