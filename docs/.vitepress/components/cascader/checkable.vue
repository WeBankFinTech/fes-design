<template>
    <FForm :labelWidth="160">
        <FFormItem label="父子关联：">
            <FRadioGroup v-model="cascade">
                <FRadio :value="true">是(默认)</FRadio>
                <FRadio :value="false">否</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FCascader
        :data="data"
        checkable
        :cascade="cascade"
        :selectable="false"
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
        const cascade = ref(true);
        return {
            data,
            cascade,
        };
    },
};
</script>
