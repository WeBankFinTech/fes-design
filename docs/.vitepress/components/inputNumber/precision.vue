<template>
    <Space>
        <FInputNumber :precision="precision"></FInputNumber>
    </Space>
</template>

<script>
export default {
    setup() {
        const precision = 2;
        return {
            precision
        };
    }
};
</script>
