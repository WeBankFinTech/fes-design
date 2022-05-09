<template>
    <FForm :labelWidth="160">
        <FFormItem label="选中可取消：">
            <FRadioGroup v-model="cancelable">
                <FRadio :value="true">是(默认)</FRadio>
                <FRadio :value="false">否</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="展开次级菜单：">
            <FRadioGroup v-model="expandTrigger">
                <FRadio value="click">click(默认)</FRadio>
                <FRadio value="hover">hover</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="父节点可选中：">
            <FRadioGroup v-model="checkStrictly">
                <FRadio value="all">是</FRadio>
                <FRadio value="">否(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FCascader
        :data="data"
        :cancelable="cancelable"
        :expandTrigger="expandTrigger"
        :checkStrictly="checkStrictly"
    ></FCascader>
</template>
<script>
import { reactive, ref } from 'vue';

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
        const data = reactive(createData(4));
        const cancelable = ref(true);
        const expandTrigger = ref('hover');
        const checkStrictly = ref('');
        return {
            data,
            cancelable,
            expandTrigger,
            checkStrictly,
        };
    },
};
</script>
