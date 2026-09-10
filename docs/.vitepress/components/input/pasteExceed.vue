<template>
    <FSpace vertical>
        <FInput
            class="paste-exceed-demo"
            :modelValue="value"
            :maxlength="100"
            showWordLimit
        />
        <FInput
            class="paste-exceed-demo"
            :modelValue="programmaticValue"
            :maxlength="100"
        />
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        // 模拟业务代码程序赋值超长（原生 maxlength 拦不住程序赋值）
        const programmaticValue = ref('x'.repeat(120));

        return {
            value: ref(''),
            programmaticValue,
        };
    },
};
</script>
