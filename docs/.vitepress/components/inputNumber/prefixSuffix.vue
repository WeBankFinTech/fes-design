<template>
    <FSpace>
        <FInputNumber>
            <template #prefix>¥</template>
        </FInputNumber>
        <FInputNumber>
            <template #suffix>%</template>
        </FInputNumber>
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
