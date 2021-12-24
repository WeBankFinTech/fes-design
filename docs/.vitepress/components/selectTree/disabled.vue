<template>
    <space>
        <FSelectTree v-model="value1" :data="data" disabled> </FSelectTree>
        <FSelectTree v-model="value2" :data="data" multiple disabled> </FSelectTree>
        <FSelectTree v-model="value2" :data="data" multiple disabled collapseTags> </FSelectTree>
        <FSelectTree
            v-model="value2"
            :data="data"
            multiple
            disabled
            collapseTags
            :collapseTagsLimit="2"
        >
        </FSelectTree>
    </space>
</template>
<script>
import { reactive, ref } from 'vue';

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
        const value1 = ref("40");
        const value2 = ref(["40", "41"]);
        return {
            data,
            value1,
            value2
        };
    },
};
</script>
<style lang="less" scoped>
.fes-select-tree {
    width: 200px;
}
</style>
