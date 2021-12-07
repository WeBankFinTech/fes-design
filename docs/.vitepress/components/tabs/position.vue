<template>
    <FRadioGroup v-model="position">
        <FRadio value="top">top</FRadio>
        <FRadio value="bottom">bottom</FRadio>
        <FRadio value="left">left</FRadio>
        <FRadio value="right">right</FRadio>
    </FRadioGroup>
    <FTabs :position="position" style="height: 150px">
        <FTabPane v-for="i in 10" :name="'Tab ' + i" :value="i"
            ><div class="tab-content">Tab {{ i }}</div></FTabPane
        >
    </FTabs>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const position = ref('left');
        return {
            position
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
