<template>
    <div class="components">
        <span style="margin-right: 16px">外层组件实例:</span>
        <space>
            <FCascader       
                v-model="cascader.value"
                :options="cascader.options">
            </FCascader>
        </space>
    </div>

    <div class="change-locale">
        <span style="margin-right: 16px">Change locale of components:</span>
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
.change-locale {
    padding-bottom: 16px;
    border-bottom: 1px solid #d9d9d9;
}
.components {
    padding-top: 16px;
    padding-bottom: 16px;
}
</style>