<template>
    <FSpace vertical>
        <FInput
            v-model="value"
            class="auto-truncate-demo"
            :maxlength="100"
            :autoTruncate="false"
            showWordLimit
            placeholder="超出 100 字后不截断，可继续输入"
        />
        <FInput
            v-model="programmaticValue"
            class="auto-truncate-demo"
            type="textarea"
            :maxlength="100"
            :autoTruncate="false"
            showWordLimit
        />
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        // autoTruncate 为 false 时内容可超出 maxlength，字数统计正常计算并标红
        const programmaticValue = ref('x'.repeat(120));

        return {
            value: ref(''),
            programmaticValue,
        };
    },
};
</script>
