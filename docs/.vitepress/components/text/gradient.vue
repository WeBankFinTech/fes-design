<template>
    <div>
        <FText :gradient="gradientColor1">
            这是渐变色的文本，角度为数值类型
        </FText>
    </div>
    <div>
        <FText :gradient="gradientColor2">
            这是渐变色的文本，角度为字符串类型
        </FText>
    </div>
    <div>
        <FText :gradient="color">
            这是纯色的文本
        </FText>
    </div>
</template>

<script setup>
const gradientColor1 = {
    deg: 90,
    from: '#5384ff',
    to: '#00cb91',
};

const gradientColor2 = {
    deg: '90deg',
    from: '#5384ff',
    to: '#00cb91',
};

const color = {
    from: '#5384ff',
    to: '#5384ff',
};
</script>
