<template>
    <FPagination
        :total-count="totalCount"
        simple
        @change="handleChange"
    ></FPagination>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const totalCount = ref(1000);

        const handleChange = (currentPage, pageSize) => {
            console.log(
                '[pagination.simple] [handleChange] currentPage:',
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
