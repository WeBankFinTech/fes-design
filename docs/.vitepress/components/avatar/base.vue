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
        </FForm>
    </FSpace>

    <FSpace>
        <FAvatar :size="size" :shape="shape">
            <UserOutlined />
        </FAvatar>
    </FSpace>
    <FSpace>
        <FAvatar :size="size" :shape="shape">M</FAvatar>
    </FSpace>
    <FSpace>
        <FAvatar
            :size="size"
            :shape="shape"
            src="https://fes-design.mumblefe.cn/images/fes-logo.svg"
        ></FAvatar>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(24);
const shape = ref('circle');
</script>
