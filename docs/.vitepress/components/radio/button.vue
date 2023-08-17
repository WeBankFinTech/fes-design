<template>
    <FSpace>
        <FRadioGroup v-model="val1" :cancelable="false" @change="handleChange">
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3" disabled>选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
        <FRadioGroup
            v-model="val2"
            :cancelable="false"
            size="small"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3">选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
    </FSpace>
    <FSpace>
        <FRadioGroup
            v-model="val3"
            :cancelable="false"
            type="primary"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3" disabled>选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
        <FRadioGroup
            v-model="val4"
            :cancelable="false"
            size="small"
            type="primary"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3">选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
    </FSpace>
    <FSpace>
        <FRadioGroup
            v-model="val5"
            :cancelable="false"
            :bordered="false"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3" disabled>选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
        <FRadioGroup
            v-model="val6"
            :cancelable="false"
            size="small"
            :bordered="false"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3">选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
    </FSpace>
    <FSpace>
        <FRadioGroup
            v-model="val7"
            :cancelable="false"
            :bordered="false"
            type="primary"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3" disabled>选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
        <FRadioGroup
            v-model="val8"
            :cancelable="false"
            type="primary"
            size="small"
            :bordered="false"
            @change="handleChange"
        >
            <FRadioButton :value="1">选项一</FRadioButton>
            <FRadioButton :value="2">选项二</FRadioButton>
            <FRadioButton :value="3">选项三</FRadioButton>
            <FRadioButton :value="4">选项四</FRadioButton>
        </FRadioGroup>
    </FSpace>
</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const val1 = ref(1);
        const val2 = ref(1);
        const val3 = ref(1);
        const val4 = ref(1);
        const val5 = ref(1);
        const val6 = ref(1);
        const val7 = ref(1);
        const val8 = ref(1);

        const handleChange = (value) => {
            console.log('[radio.button] [handleChange] value:', value);
        };
        return {
            val1,
            val2,
            val3,
            val4,
            val5,
            val6,
            val7,
            val8,
            handleChange,
        };
    },
};
</script>
