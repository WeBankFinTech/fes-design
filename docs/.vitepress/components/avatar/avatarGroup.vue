<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="尺寸:">
                <FInputNumber v-model="size" :step="10"></FInputNumber> px
            </FFormItem>
            <FFormItem label="形状:">
                <FRadioGroup
                    v-model="shape"
                    :options="[
                        { label: '圆形(默认)', value: 'circle' },
                        { label: '方形', value: 'square' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="展示个数:">
                <FInputNumber v-model="max" :min="0"></FInputNumber>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FAvatarGroup :size="size" :options="options" :max="max" :shape="shape">
            <FAvatar
                src="https://fes-design.mumblefe.cn/images/fes-logo.svg"
            ></FAvatar>
            <FAvatar
                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            ></FAvatar>
            <FAvatar>M</FAvatar>
            <FAvatar><UserOutlined /></FAvatar>
        </FAvatarGroup>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(32);

const max = ref(3);

const shape = ref('circle');

const options = [
    {
        src: '/images/1.jpeg',
    },
    {
        src: '/images/2.jpeg',
    },
];
</script>
