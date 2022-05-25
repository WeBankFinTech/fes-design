<template>
    <FSpace>
        <FInputNumber
            :step="step"
            :max="12"
            :precision="precision"
        ></FInputNumber>
    </FSpace>
</template>

<script lang="ts">
export default {
    setup() {
        const precision = 2;
        const step = 5;
        return {
            precision,
            step,
        };
    },
};
</script>
