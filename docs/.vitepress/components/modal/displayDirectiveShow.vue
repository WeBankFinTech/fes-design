<template>
    <FSpace>
        <FButton @click="show = true">displayDirective: show</FButton>
        <FModal
            v-model:show="show"
            title="displayDirective show demo"
            displayDirective="show"
            :maxHeight="200"
            @ok="show = false"
        >
            <div v-for="n in 20" :key="n">我是内容... {{ n }}</div>
        </FModal>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const show = ref(false);
</script>