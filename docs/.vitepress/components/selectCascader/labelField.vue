<template>
    <FForm :labelWidth="160">
        <FFormItem label="是否展示路径：">
            <FRadioGroup v-model="shwoAllLevels">
                <FRadio :value="true">true</FRadio>
                <FRadio :value="false">false</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSelectCascader v-model="value" :data="data">
        <template #tag="{ option }">
            <template v-if="shwoAllLevels">
                {{ option.labelPath.join(' / ') }}
            </template>
            <template v-else>
                {{ option.value ? `${option.value} - ${option.label}` : '' }}
            </template>
        </template>
    </FSelectCascader>
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
            x: `${key}-${createLabel(level)}`,
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
        const shwoAllLevels = ref(true);
        const value = ref(null);
        return {
            data,
            shwoAllLevels,
            value,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
