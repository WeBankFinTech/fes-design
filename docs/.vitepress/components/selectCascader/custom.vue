<template>
    <FForm :labelWidth="160">
        <FFormItem label="是否展示路径：">
            <FRadioGroup v-model="showPath">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="是否多选：">
            <FRadioGroup v-model="multiple">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSelectCascader
        v-if="!multiple"
        :data="data"
        valueField="id"
        labelField="name"
        childrenField="child"
    >
        <template #tag="{ option }">
            <FEllipsis>
                <template v-if="showPath">
                    {{
                        option.path
                            .map((item) => `${item.value}-${item.label}`)
                            .join(' / ')
                    }}
                </template>
                <template v-else>
                    {{
                        option.value ? `${option.value} - ${option.label}` : ''
                    }}
                </template>
            </FEllipsis>
        </template>
    </FSelectCascader>
    <FSelectCascader
        v-else
        :data="data"
        multiple
        valueField="id"
        labelField="name"
        childrenField="child"
    >
        <template #tag="{ option }">
            <FTag type="info" size="small">
                <FEllipsis>
                    <template v-if="showPath">
                        {{
                            option.path
                                .map((item) => `${item.value}-${item.label}`)
                                .join(' / ')
                        }}
                    </template>
                    <template v-else>
                        {{
                            option.value
                                ? `${option.value} - ${option.label}`
                                : ''
                        }}
                    </template>
                </FEllipsis>
            </FTag>
        </template>
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
            name: createLabel(level),
            id: key,
            child: createData(level - 1, key, prefix, suffix),
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
        const showPath = ref(true);
        const multiple = ref(true);
        return {
            data,
            showPath,
            multiple,
        };
    },
};
</script>
<style scoped>
.fes-select-cascader {
    width: 200px;
}
</style>
