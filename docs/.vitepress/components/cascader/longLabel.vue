<template>
    <FCascader :data="data"></FCascader>
</template>
<script>
import { reactive, ref } from 'vue';

function repeatString(str, n) {
    return new Array(n + 1).join(str);
}

function createData(level = 1, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            label: repeatString(createLabel(level), 10),
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
        const cancelable = ref(true);
        return {
            data,
            cancelable,
        };
    },
};
</script>
