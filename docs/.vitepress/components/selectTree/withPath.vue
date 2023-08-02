<template>
    <FForm :labelWidth="160">
        <FFormItem label="emitPath：">
            <FRadioGroup v-model="emitPath">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="showPath：">
            <FRadioGroup v-model="showPath">
                <FRadio :value="false">false(默认)</FRadio>
                <FRadio :value="true">true</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="勾选策略：">
            <FRadioGroup v-model="checkStrictly">
                <FRadio value="all">all</FRadio>
                <FRadio value="parent">parent</FRadio>
                <FRadio value="child">child</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="单选：">
            <FSelectTree
                v-model="singleValue"
                :emitPath="emitPath"
                :showPath="showPath"
                :data="data"
            ></FSelectTree>
        </FFormItem>
        <FFormItem label="modelValue：">
            {{ singleValue }}
        </FFormItem>
        <FFormItem label="多选：">
            <FSelectTree
                v-model="multipleValue"
                :emitPath="emitPath"
                :showPath="showPath"
                :checkStrictly="checkStrictly"
                :data="data"
                cascade
                multiple
            ></FSelectTree>
        </FFormItem>
        <FFormItem label="modelValue：">
            {{ multipleValue }}
        </FFormItem>
    </FForm>
</template>
<script>
import { ref, h } from 'vue';
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
        const data = ref([]);
        const emitPath = ref(true);
        const showPath = ref(true);
        const checkStrictly = ref('child');

        const init = ['40', '4030', '403020', '40302010'];

        const singleValue = ref(init);
        const multipleValue = ref([init]);

        setTimeout(() => {
            data.value = createData(4);
        });
        return {
            data,
            singleValue,
            multipleValue,
            emitPath,
            showPath,
            checkStrictly,
        };
    },
};
</script>
<style scoped>
.fes-select-tree {
    width: 200px;
}
</style>
