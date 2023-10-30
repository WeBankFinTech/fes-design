<template>
    <FForm labelWidth="150px">
        <FFormItem label="对齐方式:">
            <FRadioGroup
                v-model="labelPosition"
                :options="[
                    { label: '左对齐(默认)', value: 'left' },
                    { label: '右对齐', value: 'right' },
                    { label: '顶对齐', value: 'top' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <div class="tab-content">
        <FForm
            :labelWidth="labelPosition === 'top' ? undefined : 100"
            :labelPosition="labelPosition"
        >
            <FFormItem label="姓名">
                <FInput placeholder="请输入姓名"></FInput>
            </FFormItem>
            <FFormItem label="手机号码">
                <FInput placeholder="请输入手机号码"></FInput>
            </FFormItem>
            <FFormItem label="这是一段长的表单项描述">
                <FInput placeholder="请输入"></FInput>
            </FFormItem>
        </FForm>
    </div>
</template>

<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const labelPosition = ref('left');

        return {
            labelPosition,
        };
    },
});
</script>

<style scoped>
.tab-content {
    margin-top: 24px;
}
</style>
