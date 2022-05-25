<template>
    <FSpace>
        <FInputNumber :precision="precision"></FInputNumber>
    </FSpace>
</template>

<script>
export default {
    setup() {
        const precision = 2;
        return {
            precision,
        };
    },
};
</script>
