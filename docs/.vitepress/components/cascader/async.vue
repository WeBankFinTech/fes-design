<template>
    <FCascader :data="data" :loadData="loadData" checkable remote></FCascader>
</template>
<script>
import { reactive } from 'vue';

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
        const data = reactive([]);
        const loadData = (node) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let children = [];
                    if (node) {
                        children = [
                            {
                                label: `${node.label}1`,
                                value: `${node.value}-1`,
                                isLeaf:
                                    node.value.split('-').length > 1
                                        ? true
                                        : false,
                            },
                            {
                                label: `${node.label}2`,
                                value: `${node.value}-2`,
                                isLeaf:
                                    node.value.split('-').length > 1
                                        ? true
                                        : false,
                            },
                        ];
                    } else {
                        children = createData(2);
                    }
                    resolve(children);
                }, 2000);
            });
        };

        return {
            loadData,
            data,
        };
    },
};
</script>
