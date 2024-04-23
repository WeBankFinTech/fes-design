<template>
    <FForm :labelWidth="160">
        <FFormItem label="是否原生滚动条：">
            <FRadioGroup v-model="native">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FScrollbar height="200px" style="width: 100%" :native="native">
            <div class="scroll-list">
                <div
                    v-for="(item, index) in vals"
                    :key="index"
                    class="scroll-item"
                >
                    {{ item }}
                </div>
            </div>
        </FScrollbar>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const native = ref(true);

        const vals = ref([]);
        for (let i = 0; i < 50; ++i) {
            vals.value.push(i);
        }
        return {
            vals,
            native,
        };
    },
};
</script>

<style scoped>
.scroll-list {
    margin: 0;
    padding: 0;
    width: 1000px;
}
.scroll-list > .scroll-item {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.scroll-list > .scroll-item + .scroll-item {
    margin-top: 8px;
}
</style>
