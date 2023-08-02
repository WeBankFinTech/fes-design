<template>
    <FForm :labelWidth="160">
        <FFormItem label="父子关联：">
            <FRadioGroup v-model="cascade">
                <FRadio :value="true">是(默认)</FRadio>
                <FRadio :value="false">否</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="cascade" label="勾选策略：">
            <FRadioGroup v-model="checkStrictly">
                <FRadio value="all">all</FRadio>
                <FRadio value="parent">parent</FRadio>
                <FRadio value="child">child(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="展开次级菜单：">
            <FRadioGroup v-model="expandTrigger">
                <FRadio value="click">click(默认)</FRadio>
                <FRadio value="hover">hover</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="是否展示路径：">
            <FRadioGroup v-model="showPath">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSelectCascader
        :data="data"
        multiple
        :cascade="cascade"
        :checkStrictly="checkStrictly"
        :expandTrigger="expandTrigger"
        :showPath="showPath"
        clearable
    >
    </FSelectCascader>
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
        const cascade = ref(true);
        const checkStrictly = ref('child');
        const expandTrigger = ref('click');
        const showPath = ref(false);
        return {
            data,
            cascade,
            checkStrictly,
            expandTrigger,
            showPath,
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
