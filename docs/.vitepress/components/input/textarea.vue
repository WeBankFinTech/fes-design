<template>
    <Space>
        <FInput type="textarea" placeholder="请输入"></FInput>
        <FInput
            type="textarea"
            style="margin-top: 20px"
            v-model="autoSizeValue"
            :autosize="{ minRows: 2, maxRows: 5 }"
            placeholder="请输入"
        ></FInput>
        <FInput
            style="margin-top: 20px"
            type="textarea"
            modelValue="hello disabled textarea"
            disabled
            placeholder="请输入"
        ></FInput>
    </Space>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const autoSizeValue = ref();
        return {
            autoSizeValue
        };
    }
};
</script>
