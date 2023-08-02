<template>
    <FSelectTree :data="data">
        <template #tag="{ option }">
            {{ option.value }}-{{ option.label }}
        </template>
    </FSelectTree>
</template>
<script>
import { reactive, h } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix = null, suffix = null) {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key, prefix, suffix),
            x: `${key}-${createLabel(level)}`,
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
        return {
            data,
        };
    },
};
</script>
<style scoped>
.fes-select-tree {
    width: 200px;
}
</style>
