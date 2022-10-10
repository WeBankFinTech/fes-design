<template>
    <FForm :labelWidth="200">
        <FFormItem label="仅可选中同一根节点下的选项：">
            <FSelectCascader
                v-model="currentValue1"
                :data="data1"
                :loadData="loadData"
                multiple
                cascade
                checkStrictly="parent"
                clearable
                remote
                emitPath
                @change="handleChange1"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="modelValue：">{{ currentValue1 }}</FFormItem>
    </FForm>
</template>
<script>
import { reactive, ref, nextTick } from 'vue';
import { differenceWith } from 'lodash-es';

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
        const loadData = (node) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let children = [];
                    // 非第一级
                    if (node) {
                        children = [
                            {
                                label: `${node.label}1`,
                                value: `${node.value}-1`,
                                isLeaf:
                                    node.value.split('-').length > 0
                                        ? true
                                        : false,
                            },
                            {
                                label: `${node.label}2`,
                                value: `${node.value}-2`,
                                isLeaf:
                                    node.value.split('-').length > 0
                                        ? true
                                        : false,
                            },
                        ];
                    } else {
                        // 第一级
                        children = createData(2);
                    }
                    resolve(children);
                }, 1000);
            });
        };

        const data1 = reactive([]);
        const initValue = [
            ['20', '2010', '2010-1'],
            ['20', '2010', '2010-2'],
        ];
        const currentValue1 = ref(initValue);
        const tempValue1 = ref(initValue);
        const handleChange1 = (value) => {
            console.log(
                '[handleChange1] value:',
                value,
                ' || tempValue1:',
                tempValue1.value,
            );

            const diffValue = differenceWith(
                value,
                tempValue1.value,
                (current, before) => {
                    return current[0] === before[0];
                },
            );
            // 若存在不同项，则说明有新增其他根节点下子节点的情况
            // 若不存在不同项，则说明选中项取消选中或者选中当前根节点下的其他子节点，此种情况可忽略处理
            if (diffValue.length) {
                const rootNodeValue = diffValue[0][0];
                const formatValue = value.filter((item) => {
                    return item[0] === rootNodeValue;
                });
                nextTick(() => {
                    currentValue1.value = formatValue;
                    tempValue1.value = formatValue;
                });
            } else {
                tempValue1.value = value;
            }
        };

        return {
            loadData,
            data1,
            handleChange1,
            currentValue1,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
