<template>
    勾选策略：
    <FRadioGroup v-model="checkStrictly">
        <FRadio value="all">all</FRadio>
        <FRadio value="parent">parent</FRadio>
        <FRadio value="child">child</FRadio>
    </FRadioGroup>
    <br />
    <FSelectTree
        :data="data"
        multiple
        cascade
        :checkStrictly="checkStrictly"
        clearable
    >
    </FSelectTree>
</template>
<script>
import { reactive, ref, h } from 'vue';
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
        const checkStrictly = ref('all');
        return {
            data,
            checkStrictly,
        };
    },
};
</script>
<style scoped>
.fes-select-tree {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
