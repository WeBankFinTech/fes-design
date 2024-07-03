<template>
    <FTabs @change="handleChange" @clickTab="handleClickTab">
        <FTabPane name="T恤" value="T恤">
            <div class="tab-content">T恤</div>
        </FTabPane>
        <FTabPane name="卫衣啊卫衣" value="卫衣" displayDirective="show">
            <div class="tab-content">卫衣</div>
        </FTabPane>
        <FTabPane name="衬衫" value="衬衫">
            <div class="tab-content">衬衫</div>
        </FTabPane>
    </FTabs>
</template>

<script lang="ts" setup>
const handleChange = (value: string | number) => {
    console.log('[tabs.common] handleChange, value:', value);
};
const handleClickTab = (value: string | number) => {
    console.log('[tabs.common] handleClickTab, value:', value);
};
</script>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 60px;
    text-align: center;
}
</style>
