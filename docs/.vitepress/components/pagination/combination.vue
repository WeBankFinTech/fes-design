<template>
    <FPagination
        :total-count="1000"
        show-size-changer
        show-quick-jumper
        show-total
        @change="handleChange"
    ></FPagination>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const handleChange = (currentPage, pageSize) => {
            console.log(
                '[pagination.combination] [handleChange] currentPage:',
                currentPage,
                ' pageSize:',
                pageSize,
            );
        };
        return {
            handleChange,
        };
    },
});
</script>
