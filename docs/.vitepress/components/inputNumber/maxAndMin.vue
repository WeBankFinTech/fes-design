<template>
    <FSpace>
        <FInputNumber :min="min" :max="max" />
    </FSpace>
</template>

<script>
export default {
    setup() {
        const min = 1;
        const max = 10;
        return {
            min,
            max,
        };
    },
};
</script>
