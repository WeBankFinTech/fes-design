<template>
    <div class="title">
        <span>默认语言:</span>
    </div>
    <div class="components">
        <FCascaderV1></FCascaderV1>
    </div>
    <FDivider></FDivider>

    <div class="title">
        <span style="margin-right: 16px">语言切换:</span>
        <FRadioGroup v-model="lang">
            <FRadio key="cn" :value="zhCN.name">{{ zhCN.desc }}</FRadio>
            <FRadio key="en" :value="enUS.name">{{ enUS.desc }}</FRadio>
        </FRadioGroup>
    </div>
    <div class="components">
        <FConfigProvider :locale="locale">
            <div class="gap">
                <FCascaderV1></FCascaderV1>
            </div>
            <Space class="gap">
                <FPagination
                    :total-count="1000"
                    show-size-changer
                    show-quick-jumper
                    show-total
                ></FPagination>
            </Space>
            <Space class="gap">
                <FTimePicker></FTimePicker>
            </Space>
            <Space class="gap">
                <FDatePicker :control="true" />
                <FDatePicker type="month" :control="true" />
                <FDatePicker type="year" :control="true" />
                <FDatePicker type="quarter" :control="true" />
                <FDatePicker type="datetime" :control="true" />
                <FDatePicker type="daterange" :control="true" />
                <FDatePicker type="datetimerange" :control="true" />
            </Space>
            <Space class="gap">
                <FUpload
                    action="https://run.mocky.io/v3/2d9d9844-4a46-4145-8f57-07e13768f565"
                />
            </Space>
        </FConfigProvider>
    </div>
    <FDivider></FDivider>

    <div class="title">
        <div>嵌套配置:</div>
    </div>
    <div ref="componentsRef" class="components">
        <Space>
            <FConfigProvider :locale="enUS">
                <FCascaderV1></FCascaderV1>
                <Space>
                    <FConfigProvider
                        :locale="zhCN"
                        :getContainer="getContainer"
                    >
                        <FCascaderV1></FCascaderV1>
                        <Space>
                            <FConfigProvider :locale="enUS">
                                <FCascaderV1></FCascaderV1>
                            </FConfigProvider>
                        </Space>
                    </FConfigProvider>
                </Space>
            </FConfigProvider>
        </Space>
    </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
// eslint-disable-next-line import/no-unresolved
import { zhCN, enUS } from '@fesjs/fes-design';

const lang = ref(zhCN.name);
const locale = ref(zhCN);

watch(lang, () => {
    if (!lang.value) return;
    if (lang.value === zhCN.name) {
        locale.value = zhCN;
    } else {
        locale.value = enUS;
    }
});

export default defineComponent({
    setup() {
        const componentsRef = ref(null);
        const getContainer = () => {
            console.log(componentsRef.value);
            return componentsRef.value;
        };
        return {
            componentsRef,
            getContainer,
            enUS,
            zhCN,
            lang,
            locale,
        };
    },
});
</script>

<style scoped>
.components {
    margin-top: 8px;
}
.components .gap {
    margin-bottom: 10px;
}
</style>
