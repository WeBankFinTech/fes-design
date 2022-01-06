<template>
    <div class="title">
        <span>默认为中文:</span>
    </div>
    <div class="components">
        <Space>
            <FCascader       
                v-model="cascader.value"
                :options="cascader.options">
            </FCascader>
        </Space>
    </div>
    <FDivider></FDivider>

    <div class="title">
        <span style="margin-right: 16px">语言切换:</span>
        <FRadioGroup v-model="lang">
            <FRadio key="en" :value="enUS.name">{{ enUS.desc }}</FRadio>
            <FRadio key="cn" :value="zhCN.name">{{ zhCN.desc }}</FRadio>
        </FRadioGroup>
    </div>
    <div class="components">
        <Space class="gap">
            <FConfigProvider :locale="locale">
                <FCascader       
                    v-model="cascader.value"
                    :options="cascader.options">
                </FCascader>
            </FConfigProvider>
        </Space>
        <Space class="gap">
            <FPagination :total-count="1000" show-size-changer show-quick-jumper show-total></FPagination>
        </Space>
        <Space>
            <FInput/>
        </Space>
    </div>
    <FDivider></FDivider>

    <div class="title">
        <div>嵌套配置:</div>
    </div>
    <div class="components">
        <Space>
            <FConfigProvider :locale="enUS">
                <FCascader       
                    v-model="cascader.value"
                    :options="cascader.options">
                </FCascader>
                    <Space>
                        <FConfigProvider :locale="zhCN">
                            <FCascader       
                                v-model="cascader.value"
                                :options="cascader.options">
                            </FCascader>
                                <Space>
                                    <FConfigProvider :locale="enUS">
                                        <FCascader       
                                            v-model="cascader.value"
                                            :options="cascader.options">
                                        </FCascader>
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
    import { zhCN, enUS } from '@fesjs/fes-design'

    const lang = ref(enUS.name);
    const locale = ref(enUS);

    watch(lang, () => {
        if (lang.value === zhCN.name) {
            locale.value = zhCN
        } else {
            locale.value = enUS
        }
    })
    
    // 级联选择
    const useCascader = () => {
        return {
            value: '',
            options: [],
        }
    }

    export default defineComponent({
        setup() {
            // 级联选择
            const cascader = useCascader()

            return {
                enUS,
                zhCN,
                lang,
                locale,
                cascader,
            }
        }
    })
</script>

<style scoped>
.components {
    margin-top: 8px;
}
.components .gap {
    margin-bottom: 10px;
}
</style>