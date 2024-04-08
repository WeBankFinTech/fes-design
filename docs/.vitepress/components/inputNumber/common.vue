<template>
    <FForm>
        <FFormItem label="显示步进箭头">
            <FSwitch v-model="showStepAction" />
        </FFormItem>
    </FForm>
    <FInputNumber
        v-model="val"
        :max="100"
        :showStepAction="showStepAction"
        :autofocus="true"
    ></FInputNumber>
</template>

<script setup>
import { ref } from 'vue';

const val = ref(10);
const showStepAction = ref(true);
</script>
