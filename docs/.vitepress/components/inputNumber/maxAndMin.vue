<template>
    <FSpace>
        <FInputNumber :min="min" :max="max"></FInputNumber>
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
