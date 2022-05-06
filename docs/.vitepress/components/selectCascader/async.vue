<template>
    <FForm :labelWidth="160">
        <FFormItem label="单选：">
            <FSelectCascader
                :data="data1"
                :loadData="loadData"
                clearable
                remote
                emitPath
                @change="handleChange"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="多选：">
            <FSelectCascader
                :data="data2"
                :loadData="loadData"
                multiple
                cascade
                checkStrictly="parent"
                clearable
                remote
                emitPath
                @change="handleChange"
            ></FSelectCascader>
        </FFormItem>
    </FForm>
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
        const data1 = reactive(createData(2));
        const data2 = reactive(createData(2));
        const loadData = (node) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    node.children = [
                        {
                            label: `${node.label}1`,
                            value: `${node.value}-1`,
                            isLeaf:
                                node.value.split('-').length > 1 ? true : false,
                        },
                        {
                            label: `${node.label}2`,
                            value: `${node.value}-2`,
                            isLeaf:
                                node.value.split('-').length > 1 ? true : false,
                        },
                    ];
                    resolve();
                }, 2000);
            });
        };

        const handleChange = (value) => {
            console.log('value:', value);
        };

        return {
            loadData,
            data1,
            data2,
            handleChange,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
