<template>
    <FText :gradient="gradient">
        这是渐变色的文本
    </FText>
    <FText :gradient="color">
        这是纯色的文本
    </FText>
</template>

<script setup>
const gradient = {
    deg: 90,
    from: '#5384ff',
    to: '#00cb91',
};

const color = {
    from: '#5384ff',
    to: '#5384ff',
};
</script>
