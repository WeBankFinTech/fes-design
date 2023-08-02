<template>
    <FForm :labelWidth="160">
        <FFormItem label="emitPath：">
            <FRadioGroup v-model="emitPath">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FForm :labelWidth="160">
        <FFormItem label="单选：">
            <FSelectCascader
                v-model="value1"
                :data="data.options"
                clearable
                :emitPath="emitPath"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="modelValue：">{{ value1 }}</FFormItem>
        <FFormItem label="多选：">
            <FSelectCascader
                v-model="value2"
                :data="data.options"
                multiple
                cascade
                clearable
                :emitPath="emitPath"
            ></FSelectCascader>
        </FFormItem>
        <FFormItem label="modelValue：">{{ value2 }}</FFormItem>
    </FForm>
</template>
<script>
import { reactive, ref, h } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix = null, suffix = null) {
    if (!level) return undefined;
    return Array.apply(null, { length: 15 }).map((_, index) => {
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
        const data = reactive({
            options: [],
        });

        const value1 = ref(['213', '213114']);
        const value2 = ref([
            ['213', '213113'],
            ['213', '213114'],
        ]);
        const emitPath = ref(true);

        setTimeout(() => {
            data.options = createData(2);
        }, 1000);

        return {
            data,
            value1,
            value2,
            emitPath,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>
