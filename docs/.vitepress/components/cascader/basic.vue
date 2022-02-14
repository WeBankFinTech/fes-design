<template>
    <div class="text-tips">默认单选：</div>
    <FCascader
        v-model="base.value1"
        :options="base.options"
        @change="base.handleChange"
    >
    </FCascader>
    <div class="text-tips">hover单选：</div>
    <FCascader
        :options="base.options"
        :nodeConfig="{ expandTrigger: 'hover' }"
        @change="base.handleChange"
    >
    </FCascader>
    <div class="text-tips">单选不展示路径：</div>
    <FCascader
        v-model="base.valueEmitPath"
        :options="base.options"
        :showAllLevels="false"
        :clearable="true"
        :nodeConfig="{ emitPath: true }"
        @change="base.handleChange"
    >
    </FCascader>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';

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

// 基础用法
const useBase = () => {
    const state = reactive({
        value1: '110101',
        value2: '',
        valueEmitPath: ['13000', '130200'],
    });

    return {
        ...toRefs(state),
        options,
        handleChange,
    };
};

export default defineComponent({
    setup() {
        // 基础用法
        const base = useBase();

        return {
            base,
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
