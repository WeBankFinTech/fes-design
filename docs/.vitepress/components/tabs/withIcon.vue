<template>
    <FTabs>
        <!-- <FTabPane value="微笑">
            <template #tab><span><UserOutlined /> 微笑</span></template>
            <div class="tab-content">微笑</div>
        </FTabPane> -->
        <FTabPane value="等待">
            <template #tab
                ><span><ClockCircleOutlined /> 等待</span></template
            >
            <div class="tab-content">等待</div>
        </FTabPane>
    </FTabs>
</template>

<style scoped>
.tab-content{
    background: #FFF;
    line-height: 60px;
    text-align: center;
}
</style>