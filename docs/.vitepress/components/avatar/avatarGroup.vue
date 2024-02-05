<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="尺寸:">
                <FInputNumber v-model="size" :step="10"></FInputNumber> px
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FAvatarGroup :size="size" :options="options">
            <FAvatar
                :size="size"
                src="https://fes-design.mumblefe.cn/images/fes-logo.svg"
            ></FAvatar>
            <FAvatar
                :size="size"
                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            ></FAvatar>
            <FAvatar :size="size">M</FAvatar>
            <FAvatar :size="size"><UserOutlined /></FAvatar>
        </FAvatarGroup>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(32);

const options = [
    {
        src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    },
    {
        src: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
    },
];
</script>
