<template>
    <Space>
        <FTimePicker
            placeholder="请输入"
            v-model="currentTime"
            v-model:open="isOpen"
        >
            <template #addon="slotProps">
                <div style="text-align: right; padding: 8px 12px">
                    <FButton
                        type="primary"
                        size="small"
                        @click="confirm(slotProps.activeTime)"
                        >happy时刻</FButton
                    >
                </div>
            </template>
        </FTimePicker>
    </Space>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const currentTime = ref();
        const isOpen = ref(false);
        const confirm = (activeTime) => {
            console.log(currentTime.value);
            currentTime.value = activeTime;
            isOpen.value = false;
        };
        return {
            currentTime,
            isOpen,
            confirm
        };
    }
};
</script>
