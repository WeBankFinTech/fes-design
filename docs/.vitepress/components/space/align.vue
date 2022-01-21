<template>
    <FRadioGroup v-model="align">
        <FRadio value="start">start</FRadio>
        <FRadio value="center">center</FRadio>
        <FRadio value="end">end</FRadio>
        <FRadio value="baseline">baseline</FRadio>
    </FRadioGroup>

    <FDivider></FDivider>

    <div class="space-wrapper">
        <FSpace :align="align">
            text
            <FButton>Button</FButton>

            <div class="box-wrapper">
                <FSpace vertical>
                    text
                    <FButton>Button</FButton>
                </FSpace>
            </div>
        </FSpace>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const align = ref('start');
</script>

<style scoped>
.space-wrapper {
    width: 280px;
    margin-bottom: 20px;
    padding: 8px;
    border: 1px solid #ccc;
}
.box-wrapper {
    border: 1px solid #ccc;
    padding: 8px;
}
</style>
