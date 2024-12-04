<template>
    <FDropdown
        v-model="dropdownValue"
        arrow
        :options="options"
        showSelectedOption
        popperClass="dropdown-content-wrapper"
        @scroll="handleScroll"
        @click="handleClick"
        @change="handleChange"
    >
        <FButton>下拉菜单</FButton>
    </FDropdown>
</template>

<script setup>
import { ref } from 'vue';

const dropdownValue = ref('3');

const options = [
    {
        value: '1',
        label: '删除',
        disabled: true,
    },
    {
        value: '2',
        label: '修改',
    },
    {
        value: '3',
        label: '添加',
    },
    {
        value: '4',
        label: '评论',
    },
    {
        value: '5',
        label: '收藏',
    },
    {
        value: '6',
        label: '点赞',
    },
    {
        value: '7',
        label: '分享',
    },
    {
        value: '8',
        label: '投诉',
    },
    {
        value: '9',
        label: '建议',
    },
    {
        value: '10',
        label: '更新',
    },
    {
        value: '11',
        label: '编辑',
    },
    {
        value: '12',
        label: '更多',
    },
];

const handleScroll = (e) => {
    console.log('[dropdown.check] handleScroll, e:', e);
};
const handleClick = (value) => {
    console.log('[dropdown.check] handleClick, value:', value);
};
const handleChange = (value) => {
    console.log('[dropdown.check] handleChange, value:', value);
};
</script>

<style>
.dropdown-content-wrapper .fes-dropdown-option-wrapper {
    max-height: 320px;
}
</style>
