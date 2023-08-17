<template>
    <FForm :labelWidth="160">
        <FFormItem label="单选：">
            <FSelectCascader
                v-model="value1"
                :data="data1"
                :loadData="loadData"
                valueField="id"
                labelField="name"
                childrenField="child"
                clearable
                remote
                emitPath
                showPath
                @change="handleChange"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="modelValue：">{{ value1 }}</FFormItem>
        <FFormItem label="多选：">
            <FSelectCascader
                v-model="value2"
                :data="data2"
                :loadData="loadData"
                valueField="id"
                labelField="name"
                childrenField="child"
                multiple
                cascade
                checkStrictly="parent"
                clearable
                remote
                emitPath
                @change="handleChange"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="modelValue：">{{ value2 }}</FFormItem>
    </FForm>
</template>
<script>
import { reactive, ref } from 'vue';

function createData(level = 1, baseKey = '') {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = '' + baseKey + level + index;
        return {
            name: createLabel(level),
            id: key,
            child: createData(level - 1, key),
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
        const data2 = reactive([]);
        const loadData = (node) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let children = [];
                    // 非第一级
                    if (node) {
                        children = [
                            {
                                name: `${node.name}1`,
                                id: `${node.id}-1`,
                                isLeaf:
                                    node.id.split('-').length > 1
                                        ? true
                                        : false,
                            },
                            {
                                name: `${node.name}2`,
                                id: `${node.id}-2`,
                                isLeaf:
                                    node.id.split('-').length > 1
                                        ? true
                                        : false,
                            },
                        ];
                    } else {
                        // 第一级
                        children = createData(2);
                    }
                    resolve(children);
                }, 2000);
            });
        };

        const handleChange = (value) => {
            console.log('[selectCascader.async] [handleChange] value:', value);
        };

        const value1 = ref([]);
        const value2 = ref([
            ['20', '2010', '2010-1', '2010-1-1'],
            ['20', '2111'],
        ]);

        // 异步设置初始值
        setTimeout(() => {
            value1.value = ['20', '2010', '2010-1', '2010-1-1'];
        }, 2000);

        return {
            loadData,
            data1,
            data2,
            handleChange,
            value1,
            value2,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
