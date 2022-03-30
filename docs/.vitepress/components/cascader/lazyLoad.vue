<template>
    <FSpin :show="loading" description="加载中">
        <div class="text-tips">单选：</div>
        <FCascader
            v-model="state.value"
            :options="state.options1"
            @change="handleChange"
        >
        </FCascader>
        <div class="text-tips">hover单选：</div>
        <FCascader
            :options="state.options2"
            :nodeConfig="{ expandTrigger: 'hover' }"
            @change="handleChange"
        >
        </FCascader>
        <div class="text-tips">单选不展示路径：</div>
        <FCascader
            v-model="state.valueEmitPath"
            :options="state.options3"
            :showAllLevels="false"
            :clearable="true"
            :nodeConfig="{ emitPath: true }"
            @change="handleChange"
        >
        </FCascader>

        <div class="text-tips">默认多选：</div>
        <FCascader
            v-model="state.multiValue"
            :options="state.multiOptions1"
            :multiple="true"
            @change="handleChange"
        >
        </FCascader>
        <div class="text-tips">hover多选：</div>
        <FCascader
            :options="state.multiOptions2"
            :multiple="true"
            :nodeConfig="{ expandTrigger: 'hover' }"
            @change="handleChange"
        >
        </FCascader>
        <div class="text-tips">多选不展示路径：</div>
        <FCascader
            v-model="state.multiValueEmitPath"
            :options="state.multiOptions3"
            :multiple="true"
            :showAllLevels="false"
            :clearable="true"
            :nodeConfig="{ emitPath: true }"
            @change="handleChange"
        >
        </FCascader>
    </FSpin>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';

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
                    {
                        value: '110105',
                        label: '朝阳区',
                    },
                    {
                        value: '110106',
                        label: '丰台区',
                    },
                    {
                        value: '110107',
                        label: '石景山区',
                    },
                    {
                        value: '110108',
                        label: '海淀区',
                    },
                    {
                        value: '110109',
                        label: '门头沟区',
                    },
                    {
                        value: '110111',
                        label: '房山区',
                    },
                    {
                        value: '110112',
                        label: '通州区',
                    },
                    {
                        value: '110113',
                        label: '顺义区',
                    },
                    {
                        value: '110114',
                        label: '昌平区',
                    },
                    {
                        value: '110115',
                        label: '大兴区',
                    },
                    {
                        value: '110116',
                        label: '平谷区',
                    },
                    {
                        value: '110117',
                        label: '怀柔区',
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
            {
                value: '130400',
                label: '邯郸市',
            },
            {
                value: '130500',
                label: '邢台市',
            },
            {
                value: '130600',
                label: '保定市',
            },
            {
                value: '130700',
                label: '张家口市',
            },
            {
                value: '130800',
                label: '承德市',
            },
            {
                value: '130900',
                label: '沧州市',
            },
            {
                value: '131000',
                label: '廊坊市',
            },
            {
                value: '131100',
                label: '衡水市',
            },
        ],
    },
    {
        value: '140000',
        label: '山西省',
    },
    {
        value: '210000',
        label: '辽宁省',
    },
    {
        value: '220000',
        label: '吉林省',
    },
    {
        value: '230000',
        label: '黑龙江省',
    },
    {
        value: '310000',
        label: '上海',
    },
    {
        value: '320000',
        label: '江苏省',
    },
    {
        value: '330000',
        label: '浙江省',
    },
    {
        value: '340000',
        label: '安徽省',
    },
];

function handleChange(value) {
    console.log('Cascader || handleChange || value:', value);
}

function loadData(node) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 返回第一级数据
            if (!node) {
                return resolve(
                    options.map((item) => {
                        return {
                            value: item.value,
                            label: item.label,
                        };
                    }),
                );
            }
        }, 2000);
    });
}

const loading = ref(false);

async function initData(state) {
    loading.value = true;

    const initOptions = await loadData();
    state.options1 = initOptions;
    state.options2 = initOptions;
    state.options3 = initOptions;
    state.multiOptions1 = initOptions;
    state.multiOptions2 = initOptions;
    state.multiOptions3 = initOptions;

    loading.value = false;
}

export default defineComponent({
    setup() {
        const state = reactive({
            value: '110101',
            valueEmitPath: ['13000', '130200', '140000'],
            options1: [],
            options2: [],
            options3: [],

            multiValue: ['110101', '140000'],
            multiValueEmitPath: [
                ['110000', '110100', '110101'],
                ['130000', '130100'],
                ['140000'],
            ],
            multiOptions1: [],
            multiOptions2: [],
            multiOptions3: [],
        });

        initData(state);

        return {
            state,
            handleChange,
            loading,
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
