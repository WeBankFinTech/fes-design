<template>
    <FForm :labelWidth="160">
        <FFormItem label="是否可搜索:">
            <FRadioGroup v-model="filterable">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace>
        <div>
            单选默认：
            <FSelectCascader
                v-model="value1"
                class="select-cascader"
                :data="data"
                :filterable="filterable"
            />
        </div>
        <div>
            单选自定义过滤函数：
            <FSelectCascader
                class="select-cascader"
                :data="data"
                :filterable="filterable"
                :filter="filter"
            />
        </div>
    </FSpace>

    <FDivider />

    <FSpace vertical>
        <div>
            多选默认：
            <FSelectCascader
                v-model="value2"
                class="select-cascader-multi"
                :data="data"
                :filterable="filterable"
                :multiple="true"
                showPath
                emitPath
            />
        </div>
        <div>
            多选自定义过滤函数：
            <FSelectCascader
                class="select-cascader-multi"
                :data="data"
                :filterable="filterable"
                :multiple="true"
                :filter="filter"
                showPath
                emitPath
            />
        </div>
    </FSpace>
</template>

<script>
import { reactive, ref } from 'vue';

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

export default {
    setup() {
        const filterable = ref(true);
        const value1 = ref();
        const value2 = ref();

        const data = reactive(createData(4));

        // 默认会匹配所有节点描述，这里仅匹配叶子节点描述
        const filter = (text, option) => {
            return option.label.indexOf(text) !== -1;
        };
        return {
            filterable,
            data,
            filter,
            value1,
            value2,
        };
    },
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
