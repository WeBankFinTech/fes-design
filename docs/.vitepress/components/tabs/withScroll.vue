<template>
    <FTabs>
        <FTabPane v-for="i in 10" :name="'Tab ' + i" :value="i"
            ><div class="tab-content">Tab {{ i }}</div></FTabPane
        >
    </FTabs>
</template>

<style>
    .wrapper {
        border: 1px solid #eee;
        padding: 20px;
    }
    .tab-content{
        background: #FFF;
        line-height: 60px;
        text-align: center;
    }
</style>

<style scoped>
.tab-content{
    background: #FFF;
    line-height: 60px;
    text-align: center;
}
</style>