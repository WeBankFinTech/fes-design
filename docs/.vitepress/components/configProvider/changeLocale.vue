<template>
    <FForm :labelWidth="160">
        <FFormItem label="语言切换：">
            <FRadioGroup v-model="lang">
                <FRadio key="cn" :value="zhCN.name">
                    {{ zhCN.desc }}(默认)
                </FRadio>
                <FRadio key="en" :value="enUS.name">{{ enUS.desc }}</FRadio>
                <FRadio key="zr" :value="zr.name">{{ zr.desc }}</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider />

    <FConfigProvider :locale="locale">
        <FSpace vertical>
            <FPagination
                :total-count="1000"
                show-size-changer
                show-quick-jumper
                show-total
            />
            <FTimePicker />
            <FSpace>
                <FDatePicker :control="true" />
                <FDatePicker type="month" :control="true" />
                <FDatePicker type="year" :control="true" />
                <FDatePicker type="quarter" :control="true" />
                <FDatePicker type="datetime" :control="true" />
                <FDatePicker type="daterange" :control="true" />
                <FDatePicker type="datetimerange" :control="true" />
            </FSpace>

            <FUpload
                action="https://run.mocky.io/v3/2d9d9844-4a46-4145-8f57-07e13768f565"
            />
        </FSpace>
    </FConfigProvider>
</template>

<script setup>
import { ref, watch } from 'vue';
import { enUS, zhCN, zr } from '@fesjs/fes-design';

const lang = ref(zhCN.name);
const locale = ref(zhCN);

watch(lang, () => {
    if (!lang.value) {
        return;
    }
    if (lang.value === zhCN.name) {
        locale.value = zhCN;
    } else if (lang.value === zr.name) {
        locale.value = zr;
    } else {
        locale.value = enUS;
    }
});
</script>

<style scoped></style>
