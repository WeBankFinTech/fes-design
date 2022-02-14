<template>
    <FTree :data="data" :loadData="loadData" checkable cascade remote></FTree>
</template>
<script>
import { reactive, h } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix, suffix) {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key, prefix, suffix),
            prefix: prefix ? () => h(PictureOutlined) : null,
            suffix: suffix ? () => h(PlusCircleOutlined) : null,
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
        const data = reactive(createData(2));
        const loadData = (node) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    node.children = [
                        {
                            label: '1',
                            value: node.value + '1',
                        },
                        {
                            label: '2',
                            value: node.value + '2',
                        },
                    ];
                    resolve();
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
