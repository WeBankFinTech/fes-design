<template>
    <FForm :labelWidth="160">
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
        <FButton @click="handleReset">滚动条初始位置</FButton>
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FScrollbar
            ref="scrollbarRef"
            :height="200"
            :always="always"
            :shadow="shadow"
            style="width: 100%"
        >
            <ul class="scroll-ul">
                <li v-for="(item, index) in vals" :key="index">
                    {{ item }}
                </li>
            </ul>
        </FScrollbar>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const scrollbarRef = ref(null);
        const always = ref(true);
        const shadow = ref(true);

        const vals = ref([]);
        for (let i = 0; i < 6; ++i) {
            vals.value.push(i);
        }

        const handleReset = () => {
            scrollbarRef.value?.setScrollTop(0, 1000);
            scrollbarRef.value?.setScrollLeft(0, 300);
        };

        return {
            scrollbarRef,
            vals,
            always,
            shadow,
            handleReset,
        };
    },
};
</script>

<style scoped>
.scroll-ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 1000px;
}
.scroll-ul > li {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    list-style-type: none;
    border-bottom: 2px solid #fff;
}
.scroll-ul > li::before {
    display: none;
}
</style>
