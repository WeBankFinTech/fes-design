<template>
    <FSpace>
        <FForm :labelWidth="100">
            <FFormItem label="展示hover信息:">
                <FRadioGroup
                    v-model="showHoverTip"
                    :options="[
                        { label: '否（默认）', value: false },
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
            :showHoverTip="showHoverTip"
        >
        </FAvatarGroup>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(32);

const showHoverTip = ref(false);

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
