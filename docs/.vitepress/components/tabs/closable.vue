<template>
    <FTabs
        v-model="activeTab"
        type="card"
        addable
        closable
        @close="handleCloseTab"
        @add="handleAddTab"
        @change="handleChangeTab"
    >
        <FTabPane
            v-for="(tab, index) in tabs"
            :key="index"
            :name="tab"
            :closable="tab !== '卫衣'"
            :value="index"
        >
            <div class="tab-content">{{ tab }}</div>
        </FTabPane>
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
        const handleChangeTab = (key) => {
            console.log('[tabs.closable] [handleChangeTab] key:', key);
        };
        return {
            tabs,
            activeTab,
            handleCloseTab,
            handleAddTab,
            handleChangeTab,
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
