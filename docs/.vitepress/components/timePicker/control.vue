<template>
    <space>
        <FTimePicker
            placeholder="请输入"
            modelValue="22:22:22"
            :disabledHours="disabledHours"
            :control="false"
        ></FTimePicker>
    </space>
</template>

<script>
export default {
    setup() {
        const disabledHours = (hour) => {
            return hour === 1;
        };
        return {
            disabledHours,
        };
    },
};
</script>
