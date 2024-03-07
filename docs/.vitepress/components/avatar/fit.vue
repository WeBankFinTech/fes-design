<template>
    <FSpace>
        <FSelect
            v-model="fit"
            valueField="key"
            labelField="name"
            style="width: 200px"
            :options="optionList"
        >
        </FSelect>
    </FSpace>
    <FSpace>
        <FAvatar
            :size="size"
            :fit="fit"
            src="https://fes-design.mumblefe.cn/images/fes-logo.svg"
        ></FAvatar>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const size = ref(100);

const fit = ref('fill');

const optionList = [
    {
        name: 'fill',
        key: 'fill',
    },
    {
        name: 'contain',
        key: 'contain',
    },
    {
        name: 'cover',
        key: 'cover',
    },
    {
        name: 'none',
        key: 'none',
    },
    {
        name: 'scale-down',
        key: 'scale-down',
    },
];
</script>
