<template>
    <FForm :labelWidth="160">
        <FFormItem label="是否可搜索:">
            <FRadioGroup v-model="filterable">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-show="filterable" label="是否高亮:">
            <FRadioGroup
                v-model="filterTextHighlight"
                :options="[
                    { label: '否(默认)', value: false },
                    { label: '是', value: true },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm :labelWidth="130">
        <FFormItem label="单选默认:">
            <FSelectCascader
                v-model="value1"
                class="select-cascader"
                :data="data"
                :filterable="filterable"
                :filterTextHighlight="filterTextHighlight"
            />
        </FFormItem>
        <FFormItem label="单选自定义过滤函数:">
            <FSelectCascader
                class="select-cascader"
                :data="data"
                :filterable="filterable"
                :filter="filter"
                :filterTextHighlight="filterTextHighlight"
            />
        </FFormItem>
    </FForm>

    <FDivider />

    <FForm labelPosition="top" :labelWidth="130">
        <FFormItem label="多选默认:">
            <FSelectCascader
                v-model="value2"
                class="select-cascader-multi"
                :data="data"
                :filterable="filterable"
                :multiple="true"
                :filterTextHighlight="filterTextHighlight"
                showPath
                emitPath
            />
        </FFormItem>
        <FFormItem label="多选自定义过滤函数:">
            <FSelectCascader
                class="select-cascader-multi"
                :data="data"
                :filterable="filterable"
                :multiple="true"
                :filter="filter"
                :filterTextHighlight="filterTextHighlight"
                showPath
                emitPath
            />
        </FFormItem>
    </FForm>
</template>

<script setup>
import { reactive, ref } from 'vue';

const filterTextHighlight = ref(false);

function createData(level = 4, baseKey = '') {
    if (!level) {
        return undefined;
    }
    return Array.apply(null, { length: 10 - level }).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: `${key}-${createLabel(level)}`,
            value: key,
            children: createData(level - 1, key),
            disabled: level === 1 && index === 0,
        };
    });
}

function createLabel(level) {
    if (level === 4) {
        return '道生一';
    }
    if (level === 3) {
        return '一生二';
    }
    if (level === 2) {
        return '二生三';
    }
    if (level === 1) {
        return '三生万物';
    }
}

const filterable = ref(true);
const value1 = ref();
const value2 = ref();

const data = reactive(createData(4));

// 默认会匹配所有节点描述，这里仅匹配叶子节点描述
const filter = (text, option) => {
    return option.label.indexOf(text) !== -1;
};
</script>

<style scoped>
.select-cascader {
    width: 200px;
}
.select-cascader-multi {
    width: 100%;
}
</style>

<style>
.fes-select-cascader-popper .fes-select-dropdown {
    min-width: 500px !important;
}
</style>
