<template>
    <FSpace vertical>
        文本输入
        <FInput type="textarea" placeholder="请输入" />
        <span>最小2行/最大5行</span>
        <FInput
            v-model="autoSizeValue"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入"
        />
        禁用
        <FInput
            type="textarea"
            modelValue="hello disabled textarea"
            disabled
            placeholder="请输入"
        />
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const autoSizeValue = ref();
        return {
            autoSizeValue,
        };
    },
};
</script>
