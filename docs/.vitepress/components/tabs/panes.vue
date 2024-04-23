<template>
    <FTabs :panes="tabPanes" />
</template>

<script setup>
import { h } from 'vue';

const render = (param) =>
    h(
        'div',
        {
            style: {
                background: '#fff',
                lineHeight: '60px',
                textAlign: 'center',
            },
        },
        [param.name],
    );
const tabPanes = [
    { name: 'T恤', value: 'T恤', render },
    { name: '卫衣啊卫衣', value: '卫衣', render },
    { name: '衬衫', value: '衬衫', render, renderTab: () => '衬衫99' },
];
</script>
