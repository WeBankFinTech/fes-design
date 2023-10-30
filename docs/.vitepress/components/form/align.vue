<template>
    <FForm labelWidth="150px">
        <FFormItem label="表单布局:">
            <FRadioGroup
                v-model="layout"
                :options="[
                    { label: 'horizontal(默认)', value: 'horizontal' },
                    { label: 'inline', value: 'inline' },
                ]"
            />
        </FFormItem>
        <FFormItem label="标签位置:">
            <FRadioGroup
                v-model="labelPosition"
                :options="[
                    { label: '左对齐(默认)', value: 'left' },
                    { label: '右对齐', value: 'right' },
                    { label: '顶对齐', value: 'top' },
                ]"
            />
        </FFormItem>
        <FFormItem v-if="labelPosition !== 'top'" label="表单项对齐方式:">
            <FRadioGroup
                v-model="align"
                :options="[
                    { label: 'flex-start(默认)', value: 'flex-start' },
                    { label: 'baseline', value: 'baseline' },
                    { label: 'center', value: 'center' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <div class="tab-content">
        <FForm
            :layout="layout"
            :labelWidth="labelPosition === 'top' ? undefined : 100"
            :labelPosition="labelPosition"
            :span="layout === 'inline' ? 12 : undefined"
        >
            <FFormItem label="姓名" :align="currentAlign">
                <FInput placeholder="请输入姓名"></FInput>
            </FFormItem>
            <FFormItem label="手机号码" :align="currentAlign">
                <FInput placeholder="请输入手机号码"></FInput>
            </FFormItem>
            <FFormItem label="这是一段长的表单项描述" :align="currentAlign">
                <FInput placeholder="请输入"></FInput>
            </FFormItem>
            <FFormItem label="备注" :align="currentAlign">
                <FInput type="textarea" placeholder="请输入备注信息"></FInput>
            </FFormItem>
            <FFormItem label="年龄范围" :align="currentAlign">
                <FCheckboxGroup>
                    <FCheckbox :value="1 - 5">1 - 5</FCheckbox>
                    <FCheckbox :value="6 - 10">6 - 10</FCheckbox>
                    <FCheckbox :value="11 - 15">11 - 15</FCheckbox>
                    <FCheckbox :value="16 - 20">16 - 20</FCheckbox>
                    <FCheckbox :value="21 - 25">21 - 25</FCheckbox>
                    <FCheckbox :value="26 - 30">26 - 30</FCheckbox>
                    <FCheckbox :value="31 - 35">31 - 35</FCheckbox>
                    <FCheckbox :value="36 - 40">36 - 40</FCheckbox>
                    <FCheckbox :value="41 - 45">41 - 45</FCheckbox>
                    <FCheckbox :value="36 - 40">36 - 40</FCheckbox>
                    <FCheckbox :value="41 - 45">41 - 45</FCheckbox>
                    <FCheckbox :value="46 - 50">46 - 50</FCheckbox>
                    <FCheckbox :value="51 - 55">51 - 55</FCheckbox>
                    <FCheckbox :value="56 - 60">56 - 60</FCheckbox>
                    <FCheckbox :value="61 - 65">61 - 65</FCheckbox>
                </FCheckboxGroup>
            </FFormItem>
        </FForm>
    </div>
</template>

<script>
import { ref, defineComponent, computed } from 'vue';

export default defineComponent({
    setup() {
        const layout = ref('horizontal');
        const labelPosition = ref('right');
        const align = ref('flex-start');

        const currentAlign = computed(() =>
            labelPosition.value !== 'top' ? align.value : undefined,
        );

        return {
            layout,
            labelPosition,
            align,
            currentAlign,
        };
    },
});
</script>

<style scoped>
.tab-content {
    margin-top: 24px;
}
</style>
