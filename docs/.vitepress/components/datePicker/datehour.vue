<template>
    <FSpace vertical>
        <FDatePicker
            v-model="datehour"
            type="datehour"
            placeholder="选择日期和时间"
            clearable
        />
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const datehour = ref();
</script>