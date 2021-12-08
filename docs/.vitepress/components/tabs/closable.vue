<template>
    <FButton @click="handleAddTab">ADD</FButton><br /><br />
    <FTabs type="card" v-model="activeTab" closable @close="handleCloseTab">
        <FTabPane
            v-for="(tab, index) in tabs"
            :name="tab"
            :closable="tab !== '卫衣'"
            :value="index"
            ><div class="tab-content">{{ tab }}</div></FTabPane
        >
    </FTabs>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
    setup() {
        const tabs = reactive(['T恤', '卫衣', '衬衫', '夹克']);
        const activeTab = ref(0);

        function handleCloseTab(key) {
            tabs.splice(key, 1);
            if (activeTab.value === key) {
                activeTab.value =
                    key >= tabs.length - 1 ? tabs.length - 1 : key;
            } else if (activeTab.value > key) {
                activeTab.value = activeTab.value - 1;
            }
        }

        function handleAddTab() {
            tabs.push('New Tab' + (tabs.length + 1));
            activeTab.value = tabs.length - 1;
        }
        return {
            tabs,
            activeTab,
            handleCloseTab,
            handleAddTab
        };
    }
};
</script>

<style scoped>
.tab-content{
    background: #FFF;
    line-height: 60px;
    text-align: center;
}
</style>