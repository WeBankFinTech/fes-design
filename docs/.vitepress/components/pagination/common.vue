<template>
    <FPagination :total-count="totalCount" @change="handleChange"></FPagination>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const totalCount = ref(1000);
        const handleChange = (currentPage, pageSize) => {
            console.log(
                '[pagination.common] [handleChange] currentPage:',
                currentPage,
                ' pageSize:',
                pageSize,
            );
        };
        return {
            totalCount,
            handleChange,
        };
    },
});
</script>
