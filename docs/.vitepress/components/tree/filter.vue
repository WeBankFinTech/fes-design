<template>
    <FInput v-model="filterText" placeholder="请输入"></FInput>
    <FTree ref="refTree" :data="data" checkable :filterMethod="filterMethod">
    </FTree>
</template>
<script>
import { ref, reactive, h, watch } from 'vue';
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
        const data = reactive(createData(4));
        const filterText = ref('');
        const refTree = ref(null);
        watch(filterText, () => {
            refTree.value.filter(filterText.value);
        });
        const filterMethod = (value, node) => {
            return node.label.indexOf(value) !== -1;
        };
        return {
            data,
            filterText,
            refTree,
            filterMethod,
        };
    },
};
</script>
