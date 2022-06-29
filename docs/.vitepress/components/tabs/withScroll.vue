<template>
    <FTabs>
        <FTabPane v-for="i in 20" :key="i" :name="'Tab ' + i" :value="i">
            <div class="tab-content">Tab {{ i }}</div>
        </FTabPane>
    </FTabs>
</template>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 60px;
    text-align: center;
}
</style>
