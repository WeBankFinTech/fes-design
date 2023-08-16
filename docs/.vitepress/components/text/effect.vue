<template>
    <FForm :labelWidth="160">
        <FFormItem label="字体加粗：">
            <FRadioGroup v-model="isStrong">
                <FRadio :value="false">否</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="字体倾斜：">
            <FRadioGroup v-model="IsItalic">
                <FRadio :value="false">否</FRadio>
                <FRadio :value="true">是</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FSpace>
        <FText :strong="isStrong" :italic="IsItalic">
            道生一，一生二，二生三，三生万物
        </FText>
    </FSpace>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const isStrong = ref(true);
const IsItalic = ref(true);
</script>
