<template>
    <div class="text-tips">单选：</div>
    <FCascader
        v-model="state.value"
        :options="state.options1"
        :nodeConfig="{ emitPath: true }"
        :remote="true"
        :loadData="loadData"
        @change="handleChange"
    >
    </FCascader>
    <div class="text-tips">hover单选：</div>
    <FCascader
        :options="state.options2"
        :nodeConfig="{ emitPath: true, expandTrigger: 'hover' }"
        :remote="true"
        :loadData="loadData"
        @change="handleChange"
    >
    </FCascader>
    <div class="text-tips">单选不展示路径：</div>
    <FCascader
        v-model="state.valueEmitPath"
        :options="state.options3"
        :nodeConfig="{ emitPath: true }"
        :remote="true"
        :loadData="loadData"
        :showAllLevels="false"
        @change="handleChange"
    >
    </FCascader>

    <div class="text-tips">默认多选：</div>
    <FCascader
        v-model="state.multiValue"
        :options="state.multiOptions1"
        :nodeConfig="{ emitPath: true }"
        :multiple="true"
        :remote="true"
        :loadData="loadData"
        @change="handleChange"
    >
    </FCascader>
    <div class="text-tips">hover多选：</div>
    <FCascader
        :options="state.multiOptions2"
        :multiple="true"
        :remote="true"
        :loadData="loadData"
        :nodeConfig="{ emitPath: true, expandTrigger: 'hover' }"
        @change="handleChange"
    >
    </FCascader>
    <div class="text-tips">多选不展示路径：</div>
    <FCascader
        v-model="state.multiValueEmitPath"
        :options="state.multiOptions3"
        :multiple="true"
        :showAllLevels="false"
        :remote="true"
        :loadData="loadData"
        :nodeConfig="{ emitPath: true }"
        @change="handleChange"
    >
    </FCascader>
</template>

<script>
import { defineComponent, reactive } from 'vue';

const options = [
    {
        value: '110000',
        label: '北京市',
        children: [
            {
                value: '110100',
                label: '市辖区',
                children: [
                    {
                        value: '110101',
                        label: '东城区东城区东城区东城区东城区东城区',
                    },
                    {
                        value: '110102',
                        label: '西城区',
                    },
                    {
                        value: '110103',
                        label: '崇文区',
                    },
                    {
                        value: '110104',
                        label: '宣武区',
                    },
                ],
            },
            {
                value: '110200',
                label: '市辖县',
                children: [
                    {
                        value: '110228',
                        label: '密云县',
                    },
                    {
                        value: '110229',
                        label: '延庆县',
                    },
                ],
            },
        ],
    },
    {
        value: '130000',
        label: '河北省',
        children: [
            {
                value: '130100',
                label: '石家庄市',
            },
            {
                value: '130200',
                label: '唐山市',
            },
            {
                value: '130300',
                label: '秦皇岛市',
            },
        ],
    },
    {
        value: '140000',
        label: '山西省',
    },
];

function handleChange(value) {
    console.log('Cascader || handleChange || value:', value);
}

function getFlatOptions(nodes) {
    return nodes.reduce((res, node) => {
        if (!node.children || node.children.length < 1) {
            res.push(node);
        } else {
            res.push(node);
            res = res.concat(getFlatOptions(node.children));
        }
        return res;
    }, []);
}

const flatOptions = getFlatOptions(options);

function loadData(node) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 返回第一级数据
            if (!node) {
                return resolve(
                    options.map((node) => {
                        return {
                            value: node.value,
                            label: node.label,
                            isLeaf: node?.children?.length > 0 ? false : true, // 此项必不可少，否则当叶子节点处理
                        };
                    }),
                );
            } else {
                return resolve(
                    flatOptions
                        .find((option) => option.value === node.value)
                        ?.children?.map((node) => {
                            return {
                                value: node.value,
                                label: node.label,
                                isLeaf:
                                    node?.children?.length > 0 ? false : true, // 此项必不可少，否则当叶子节点处理
                            };
                        }) || [],
                );
            }
        }, 2000);
    });
}

export default defineComponent({
    setup() {
        const state = reactive({
            value: ['110000', '110100', '110101'],
            valueEmitPath: ['110000', '110100', '110101'],
            options1: [],
            options2: [],
            options3: [],

            multiValue: [
                ['110000', '110100', '110101'],
                ['130000', '130100'],
                ['140000'],
            ],
            multiValueEmitPath: [
                ['110000', '110100', '110101'],
                ['130000', '130100'],
                ['140000'],
            ],
            multiOptions1: [],
            multiOptions2: [],
            multiOptions3: [],
        });

        return {
            state,
            handleChange,
            loadData,
        };
    },
});
</script>

<style scoped>
.fes-cascader {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
