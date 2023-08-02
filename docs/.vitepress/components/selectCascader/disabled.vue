<template>
    <FForm :labelWidth="160">
        <FFormItem label="多选是否折叠展示：">
            <FRadioGroup v-model="collapseTags">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="collapseTags" label="折叠项限制：">
            <FRadioGroup v-model="collapseTagsLimit">
                <FRadio :value="1">1(默认)</FRadio>
                <FRadio :value="2">2</FRadio>
                <FRadio :value="3">3</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FSelectCascader v-model="value1" :data="data" disabled>
        </FSelectCascader>
        <FSelectCascader v-model="value2" :data="data" disabled>
        </FSelectCascader>
    </FSpace>
    <FSpace>
        <FSelectCascader
            v-model="value3"
            :data="data"
            multiple
            disabled
            :collapseTags="collapseTags"
            :collapseTagsLimit="collapseTagsLimit"
        >
        </FSelectCascader>
        <FSelectCascader
            v-model="value4"
            :data="data"
            multiple
            disabled
            :collapseTags="collapseTags"
            :collapseTagsLimit="collapseTagsLimit"
        >
        </FSelectCascader>
    </FSpace>
</template>
<script>
import { reactive, ref, h } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix = null, suffix = null) {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
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
        const data = reactive(createData(4));
        const value1 = ref('40');
        const value2 = ref('999999'); // 含未匹配项
        const value3 = ref(['40', '41', '4030']);
        const value4 = ref(['999999', '40', '41']); // 含未匹配项
        const collapseTags = ref(true);
        const collapseTagsLimit = ref(1);
        return {
            data,
            value1,
            value2,
            value3,
            value4,
            collapseTags,
            collapseTagsLimit,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
