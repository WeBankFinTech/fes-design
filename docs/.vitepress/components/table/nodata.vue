<template>
    <FForm :labelWidth="160">
        <FFormItem label="展示类型：">
            <FRadioGroup v-model="emptyType">
                <FRadio value="normal">默认</FRadio>
                <FRadio value="custom">自定义</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="间距大小：">
            <FRadioGroup v-model="size">
                <FRadio value="middle">middle(默认)</FRadio>
                <FRadio value="small">small</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="自定义空数据文本：">
            <FInput v-model="emptyText"></FInput>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <f-table
        v-if="emptyType === 'normal'"
        :data="data"
        :size="size"
        :emptyText="emptyText"
        bordered
    >
        <f-table-column :width="200" prop="date" label="日期"></f-table-column>
        <f-table-column :width="200" prop="name" label="姓名"></f-table-column>
        <f-table-column
            :width="200"
            prop="address"
            label="地址"
        ></f-table-column>
        <f-table-column
            :width="200"
            prop="contact"
            label="联系人"
        ></f-table-column>
        <f-table-column
            :width="200"
            prop="postcode"
            label="邮编"
        ></f-table-column>
    </f-table>

    <f-table
        v-if="emptyType === 'custom'"
        :data="data"
        :size="size"
        verticalLine
    >
        <template #empty>
            <FEmpty :description="emptyText" />
        </template>
        <f-table-column :width="200" prop="date" label="日期"></f-table-column>
        <f-table-column :width="200" prop="name" label="姓名"></f-table-column>
        <f-table-column
            :width="200"
            prop="address"
            label="地址"
        ></f-table-column>
        <f-table-column
            :width="200"
            prop="contact"
            label="联系人"
        ></f-table-column>
        <f-table-column
            :width="200"
            prop="postcode"
            label="邮编"
        ></f-table-column>
    </f-table>
</template>
<script>
import { ref, reactive } from 'vue';
export default {
    setup() {
        const emptyType = ref('normal');
        const size = ref('middle');
        const emptyText = ref();

        const data = reactive([]);
        return {
            emptyType,
            data,
            size,
            emptyText,
        };
    },
};
</script>
