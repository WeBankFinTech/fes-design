<template>
    <FForm :labelWidth="160">
        <FFormItem label="语言切换：">
            <FRadioGroup v-model="lang">
                <FRadio key="cn" :value="zhCN.name">{{ zhCN.desc }}</FRadio>
                <FRadio key="en" :value="enUS.name">{{ enUS.desc }}</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FConfigProvider :locale="locale">
        <FSpace vertical>
            <FDatePicker type="month" :control="true" />
            <FDatePicker type="datetimerange" :control="true" />
        </FSpace>
    </FConfigProvider>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { mergeWith } from 'lodash-es';
import { zhCN, enUS } from '@fesjs/fes-design';

export default defineComponent({
    setup() {
        const lang = ref(zhCN.name);
        const locale = ref(zhCN);

        const CustomLang = computed(() => {
            return {
                [zhCN.name]: {
                    datePicker: {
                        selectStartDateTime: '请选择起始时间',
                        selectEndDateTime: '请选择结束时间',
                    },
                },
                [enUS.name]: {
                    datePicker: {
                        selectStartDateTime: 'Please Select Start Time',
                        selectEndDateTime: 'Please Select End Time',
                    },
                },
            };
        });

        watch(
            lang,
            () => {
                if (!lang.value) return;
                if (lang.value === zhCN.name) {
                    locale.value = mergeWith(
                        {},
                        zhCN,
                        CustomLang.value[zhCN.name],
                    );
                } else {
                    locale.value = mergeWith(
                        {},
                        enUS,
                        CustomLang.value[enUS.name],
                    );
                }
            },
            {
                immediate: true,
            },
        );

        return {
            enUS,
            zhCN,
            lang,
            locale,
        };
    },
});
</script>

<style scoped></style>
