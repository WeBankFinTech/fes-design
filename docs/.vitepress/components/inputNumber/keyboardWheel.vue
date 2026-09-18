<template>
    <FSpace vertical>
        <FInputNumber
            v-model="value"
            :min="1"
            :max="20"
            :precision="1"
            :step="0.5"
            placeholder="聚焦后 ↑/↓ 或滚轮步进"
        />
        <FText type="secondary" >
            当前值：{{ value }}（键盘上下与滚轮步进默认开启，可通过 keyboard / wheel 关闭）
        </FText>
        <FSpace>
            <FCheckbox v-model="keyboardEnabled">keyboard（↑/↓ 步进）</FCheckbox>
            <FCheckbox v-model="wheelEnabled">wheel（滚轮步进）</FCheckbox>
        </FSpace>
    </FSpace>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
    setup() {
        const value = ref(3);
        const keyboardEnabled = ref(true);
        const wheelEnabled = ref(true);
        return {
            value,
            keyboardEnabled,
            wheelEnabled,
        };
    },
};
</script>
