<template>
    <FSpace vertical>
        <FTimePicker
            v-model="currentTime"
            v-model:open="isOpen"
            class="time-picker"
            placeholder="请输入"
        >
            <template #addon="slotProps">
                <div style="text-align: right; padding: 8px 12px">
                    <FButton
                        type="primary"
                        size="small"
                        @click="confirm(slotProps.activeTime)"
                    >
                        happy时刻
                    </FButton>
                </div>
            </template>
        </FTimePicker>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const currentTime = ref();
        const isOpen = ref(false);
        const confirm = (activeTime) => {
            console.log('[timePicker.addon] [confirm] activeTime:', activeTime);
            currentTime.value = activeTime;
            isOpen.value = false;
        };
        return {
            currentTime,
            isOpen,
            confirm,
        };
    },
};
</script>
<style>
.time-picker {
    width: 200px;
}
</style>
