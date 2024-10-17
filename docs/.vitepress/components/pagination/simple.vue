<template>
    <FSpace align="center">
        <FPagination
            v-model:currentPage="currentPage"
            :totalCount="totalCount"
            simple
            @change="handleChange"
        />
        当前选择页：{{ currentPage }}
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const totalCount = ref(1000);
const currentPage = ref(10);

const handleChange = (currentPage, pageSize) => {
    console.log(
        '[pagination.simple] [handleChange] currentPage:',
        currentPage,
        ' pageSize:',
        pageSize,
    );
};
</script>
