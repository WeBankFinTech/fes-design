<template>
    <FForm>
        <FFormItem label="位置:">
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
        </FFormItem>
        <FFormItem label="展示前缀:">
            <FSwitch v-model="showPrefix"></FSwitch>
        </FFormItem>
        <FFormItem label="展示后缀:">
            <FSwitch v-model="showSuffix"></FSwitch>
        </FFormItem>
    </FForm>
    <FDivider />

    <FTabs :position="position" style="height: 300px">
        <FTabPane
            v-for="i in 20"
            :key="i"
            :name="'Tab ' + i"
            :value="i"
            closable
        >
            <div class="tab-content">Tab {{ i }}</div>
        </FTabPane>
        <template v-if="showPrefix" #prefix>Prefix</template>
        <template v-if="showSuffix" #suffix>Suffix</template>
    </FTabs>
</template>

<script setup>
import { ref } from 'vue';

const position = ref('left');
const showPrefix = ref(true);
const showSuffix = ref(true);
</script>

<style scoped>
.tab-content {
    background: #fff;
    line-height: 60px;
    text-align: center;
}
</style>
