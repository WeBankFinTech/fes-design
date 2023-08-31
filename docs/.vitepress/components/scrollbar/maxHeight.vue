<template>
    <FForm :labelWidth="160">
        <FFormItem label="高度类型：">
            <FRadioGroup v-model="heightType">
                <FRadio value="height">固定高度</FRadio>
                <FRadio value="maxHeight">最大高度</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem v-if="heightType === 'height'" label="固定高度：">
            <FInputNumber
                v-model="height"
                :min="100"
                :max="400"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem v-if="heightType === 'maxHeight'" label="最大高度：">
            <FInputNumber
                v-model="maxHeight"
                :min="100"
                :max="400"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace vertical>
        <FScrollbar :height="height" :maxHeight="maxHeight" style="width: 100%">
            <ul class="scroll-ul">
                <li v-for="(item, index) in vals" :key="index">
                    {{ item }}
                </li>
            </ul>
        </FScrollbar>
    </FSpace>
</template>

<script>
import { ref, watch } from 'vue';
export default {
    setup() {
        const heightType = ref('maxHeight');
        const height = ref();
        const maxHeight = ref(200);

        const vals = ref([]);
        for (let i = 0; i < 6; ++i) {
            vals.value.push(i);
        }

        watch(
            heightType,
            () => {
                if (heightType.value === 'height') {
                    height.value = 200;
                    maxHeight.value = undefined;
                } else if (heightType.value === 'maxHeight') {
                    height.value = undefined;
                    maxHeight.value = 200;
                } else {
                    height.value = undefined;
                    maxHeight.value = undefined;
                }
            },
            {
                immediate: true,
            },
        );

        return {
            vals,
            heightType,
            height,
            maxHeight,
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
