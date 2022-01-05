<template>
    <div class="title">
        <span>默认为中文:</span>
    </div>
    <div class="components">
        <space>
            <FCascader       
                v-model="cascader.value"
                :options="cascader.options">
            </FCascader>
        </space>
    </div>

    <div class="title">
        <span style="margin-right: 16px">语言切换:</span>
        <FRadioGroup v-model="lang">
            <FRadio key="en" :value="enUS.name">{{ enUS.desc }}</FRadio>
            <FRadio key="cn" :value="zhCN.name">{{ zhCN.desc }}</FRadio>
        </FRadioGroup>
    </div>
    <div class="components">
        <space>
            <FConfigProvider :locale="locale">
                <FCascader       
                    v-model="cascader.value"
                    :options="cascader.options">
                </FCascader>
            </FConfigProvider>
        </space>
    </div>

    <div class="title">
        <div>嵌套配置:</div>
    </div>
    <div class="components">
        <space>
            <FConfigProvider :locale="enUS">
                <FCascader       
                    v-model="cascader.value"
                    :options="cascader.options">
                </FCascader>
                    <space>
                        <FConfigProvider :locale="zhCN">
                            <FCascader       
                                v-model="cascader.value"
                                :options="cascader.options">
                            </FCascader>
                                <space>
                                    <FConfigProvider :locale="enUS">
                                        <FCascader       
                                            v-model="cascader.value"
                                            :options="cascader.options">
                                        </FCascader>
                                    </FConfigProvider>
                                </space>
                        </FConfigProvider>
                    </space>
            </FConfigProvider>
        </space>
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
.title {
    padding-bottom: 16px;
}
.components {
    border-top: 1px solid #d9d9d9;
    padding-top: 16px;
    padding-bottom: 32px;
}
</style>