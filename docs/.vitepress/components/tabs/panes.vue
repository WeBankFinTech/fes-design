<template>
    <FTabs :panes="tabPanes"></FTabs>
</template>

<script>
export default {
    setup() {
        const render = (param) => param.name;
        const tabPanes = [
            { name: 'T恤', value: 'T恤', render },
            { name: '卫衣啊卫衣', value: '卫衣', render },
            { name: '衬衫', value: '衬衫', render, renderTab: () => '衬衫99' },
        ];
        return {
            tabPanes,
        };
    },
};
</script>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 60px;
    text-align: center;
}
</style>
