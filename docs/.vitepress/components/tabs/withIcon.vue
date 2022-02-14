<template>
    <FTabs>
        <FTabPane value="微笑">
            <template #tab>
                <span class="my-tab"><UserOutlined />&nbsp;微笑</span>
            </template>
            <div class="tab-content">微笑</div>
        </FTabPane>
        <FTabPane value="等待">
            <template #tab>
                <span class="my-tab"><ClockCircleOutlined />&nbsp;等待</span>
            </template>
            <div class="tab-content">等待</div>
        </FTabPane>
    </FTabs>
</template>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 60px;
    text-align: center;
}

.my-tab {
    display: flex;
    align-items: center;
}
</style>
