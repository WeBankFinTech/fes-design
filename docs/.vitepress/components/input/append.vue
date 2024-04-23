<template>
    <FSpace vertical>
        <FInput placeholder="请输入">
            <template #prepend> https:// </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #append>
                <FButton type="primary">搜索</FButton>
            </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #prepend>
                <FSelect v-model="selectValue" style="width: 90px">
                    <FOption :value="1">湖南</FOption>
                    <FOption :value="2" label="湖北" disabled />
                    <FOption
                        :value="3"
                        label="浙江浙江浙江浙江浙江浙江浙江浙江浙江"
                    />
                    <FOption :value="4" label="广东" />
                    <FOption :value="5" label="江苏" />
                </FSelect>
            </template>
            <template #prefix> ¥ </template>
            <template #suffix> RMB </template>
            <template #append>
                <FSelect v-model="selectValue" style="width: 90px">
                    <FOption :value="1">湖南</FOption>
                    <FOption :value="2" label="湖北" disabled />
                    <FOption
                        :value="3"
                        label="浙江浙江浙江浙江浙江浙江浙江浙江浙江"
                    />
                    <FOption :value="4" label="广东" />
                    <FOption :value="5" label="江苏" />
                </FSelect>
            </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #append>
                <FSelectCascader
                    v-model="cascaderValue"
                    :data="options"
                    style="width: 90px"
                    @change="handleChange"
                />
            </template>
        </FInput>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

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
        ],
    },
    {
        value: '140000',
        label: '山西省',
    },
];

const selectValue = ref();

const cascaderValue = ref();
const handleChange = (value) => {
    console.log('[input.append] [handleChange] value:', value);
};
</script>
