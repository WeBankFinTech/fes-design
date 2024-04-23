<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="尺寸:">
                <FRadioGroup
                    v-model="size"
                    :options="[
                        { label: 'small', value: 'small' },
                        { label: 'middle', value: 'middle' },
                        { label: 'large', value: 'large' },
                    ]"
                />
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
                <FInputNumber v-model="max" :min="0" />
            </FFormItem>
            <FFormItem label="展示hover信息:">
                <FRadioGroup
                    v-model="expandOnHover"
                    :options="[
                        { label: '否(默认)', value: false },
                        { label: '是', value: true },
                    ]"
                />
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FAvatarGroup
            :size="size"
            :options="options"
            :max="max"
            :shape="shape"
            :expandOnHover="expandOnHover"
        >
            <FAvatar
                src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
            <FAvatar>M</FAvatar>
        </FAvatarGroup>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref('middle');

const max = ref(3);

const shape = ref('circle');

const expandOnHover = ref(true);

const options = [
    {
        name: '张三',
        icon: 'UserOutlined',
    },
    {
        name: '李四',
        text: 'Fes',
    },
    {
        name: '王五',
        src: 'https://fes-design.mumblefe.cn/images/fes-logo.svg',
    },
    {
        name: '郑六',
        src: '/images/1.jpeg',
    },
];
</script>
