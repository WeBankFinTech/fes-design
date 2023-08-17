<template>
    <FSpace vertical>
        <FTimePicker
            v-model="time"
            placeholder="请输入"
            :disabledHours="disabledHours"
            :control="false"
        ></FTimePicker>
    </FSpace>
</template>

<script>
import { watch, ref } from 'vue';

export default {
    setup() {
        const time = ref('22:22:22');
        const disabledHours = (hour) => {
            return hour === 1;
        };
        watch(time, () => {
            console.log('[timePicker.control] [watch] time.value:', time.value);
        });
        return {
            time,
            disabledHours,
        };
    },
};
</script>
