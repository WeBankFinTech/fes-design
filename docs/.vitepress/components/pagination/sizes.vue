<template>
    <FPagination
        show-size-changer
        :pageSizeOption="pageSizeOption"
        :total-count="1000"
        @change="handleChange"
    ></FPagination>
</template>

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
    setup() {
        const pageSizeOption = reactive([10, 20, 30, 50, 100]);
        const handleChange = (currentPage, pageSize) => {
            console.log(
                '[pagination.sizes] [handleChange] currentPage:',
                currentPage,
                ' pageSize:',
                pageSize,
            );
        };
        return {
            pageSizeOption,
            handleChange,
        };
    },
});
</script>
