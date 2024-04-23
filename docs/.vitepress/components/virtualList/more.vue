<template>
    <FForm :labelWidth="180">
        <FFormItem label="总是显示滚动条：">
            <FRadioGroup v-model="always">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="显示待滚动区域阴影：">
            <FRadioGroup v-model="shadow">
                <FRadio :value="false">否(默认)</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="是否原生滚动条：">
            <FRadioGroup v-model="native">
                <FRadio :value="true">是</FRadio>
                <FRadio :value="false">否(默认)</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="滚动条滑块最小尺寸：">
            <FInputNumber
                v-model="minSize"
                :min="5"
                :max="50"
                :step="10"
            />
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider />

    <FSpace vertical>
        <FVirtualList
            class="virtual-scroll-list-more"
            wrapClass="virtual-scroll-list-wrap"
            :dataKey="(data) => data"
            :dataSources="vals"
            :estimateSize="80"
            :height="200"
            :shadow="shadow"
            :always="always"
            :native="native"
            :minSize="minSize"
        >
            <template #default="{ source }">
                <div class="virtual-scroll-item">
                    {{ source }}
                </div>
            </template>
        </FVirtualList>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const shadow = ref(true);
        const always = ref(true);
        const native = ref(false);
        const minSize = ref(10);

        const vals = ref([]);
        for (let i = 0; i < 100; ++i) {
            vals.value.push(i);
        }

        return {
            shadow,
            always,
            native,
            minSize,
            vals,
        };
    },
};
</script>

<style>
.virtual-scroll-list-more .virtual-scroll-list-wrap {
    margin: 0;
    padding: 0;
    width: 1000px;
}
.virtual-scroll-list-more .virtual-scroll-list-wrap .virtual-scroll-item {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.virtual-scroll-list-more
    .virtual-scroll-list-wrap
    .virtual-scroll-item
    + .virtual-scroll-item {
    margin-top: 8px;
}
</style>
