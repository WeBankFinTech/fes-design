<template>
    <FRadioGroup
        v-model="position"
        :cancelable="false"
        :options="
            ['top', 'bottom', 'left', 'right'].map((i) => ({
                label: i,
                value: i,
            }))
        "
    />
    <FDivider />

    <FTabs :position="position" style="height: 300px">
        <FTabPane v-for="i in 20" :key="i" :name="'Tab ' + i" :value="i">
            <div class="tab-content">Tab {{ i }}</div>
        </FTabPane>
    </FTabs>
</template>

<script setup>
import { ref } from 'vue';

const position = ref('left');
</script>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 300px;
    text-align: center;
}
</style>
