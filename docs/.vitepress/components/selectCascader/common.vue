<template>
    <FForm :labelWidth="160">
        <FFormItem label="展开次级菜单：">
            <FRadioGroup v-model="expandTrigger">
                <FRadio value="click">click(默认)</FRadio>
                <FRadio value="hover">hover</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="父节点可选中：">
            <FRadioGroup v-model="checkStrictly">
                <FRadio value="all">是</FRadio>
                <FRadio value="">否</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSelectCascader
        :data="data"
        :expandTrigger="expandTrigger"
        :checkStrictly="checkStrictly"
    ></FSelectCascader>
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
        const expandTrigger = ref('click');
        const checkStrictly = ref('');
        return {
            data,
            expandTrigger,
            checkStrictly,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
