<template>
    <div class="text-tips">单选：</div>
    <FCascader       
        v-model="disabled.value"
        :disabled="true"
        :options="disabled.options">
    </FCascader>
    <div class="text-tips">多选：</div>
    <FCascader       
        v-model="disabled.multipleValue"
        :multiple="true"
        :disabled="true"
        :options="disabled.options">
    </FCascader>
    <div class="text-tips">折叠选中项：</div>
    <FCascader       
        v-model="disabled.multipleValue"
        :multiple="true"
        :disabled="true"
        collapseTags
        :options="disabled.options">
    </FCascader>
</template>

<script>
    import { defineComponent, reactive, toRefs } from 'vue';
    
    const useDisabled = () => {
        const state = reactive({
            value: '140000',
            multipleValue: ["140000", "210000"],
        })

        return {
            ...toRefs(state),
            options: [
                 {
                    "value": "140000",
                    "label": "山西省",
                },
                {
                    "value": "210000",
                    "label": "辽宁省",
                },
                {
                    "value": "220000",
                    "label": "吉林省",
                },
                {
                    "value": "230000",
                    "label": "黑龙江省",
                },
                {
                    "value": "310000",
                    "label": "上海",
                },
                {
                    "value": "320000",
                    "label": "江苏省",
                },
                {
                    "value": "330000",
                    "label": "浙江省",
                },
                {
                    "value": "340000",
                    "label": "安徽省",
                }
            ],
        }
    }

    export default defineComponent({
        setup() {
            const disabled = useDisabled()

            return {
                disabled,
            }
        }
    })
</script>

<style lang="less" scoped>
.fes-cascader {
    width: 200px;
}
.text-tips {
    margin-top: 10px;
}
</style>