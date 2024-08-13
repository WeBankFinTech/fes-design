<template>
    <FForm>
        <FFormItem label="是否高亮:">
            <FRadioGroup
                v-model="filterTextHighlight"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm :labelWidth="130">
        <FFormItem label="默认:">
            <FSelectTree :data="data" filterable :filterTextHighlight="filterTextHighlight" @filter="handleFilter" />
        </FFormItem>
        <FFormItem label="自定义过滤函数:">
            <FSelectTree
                :data="data"
                filterable
                :filter="filter"
                virtualList
                :filterTextHighlight="filterTextHighlight"
            />
        </FFormItem>
    </FForm>
</template>

<script setup>
import { reactive, ref } from 'vue';

const filterTextHighlight = ref(false);

function handleFilter(query) {
    console.log('[selectTree.filterable] filter:', query);
}

function createData(level = 4, baseKey = '') {
    if (!level) {
        return undefined;
    }
    return Array.apply(null, { length: 10 - level }).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: createLabel(level),
            value: key,
            children: createData(level - 1, key),
        };
    });
}

function createLabel(level) {
    if (level === 4) {
        return '道生一';
    }
    if (level === 3) {
        return '一生二';
    }
    if (level === 2) {
        return '二生三';
    }
    if (level === 1) {
        return '三生万物';
    }
}

const data = reactive(createData(4));
const filter = (text, option) => {
    return option.label.indexOf(text) !== -1;
};
</script>

<style scoped>
.fes-select-tree {
    width: 200px;
}
</style>
