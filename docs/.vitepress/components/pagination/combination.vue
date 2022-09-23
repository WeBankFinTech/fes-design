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
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const handleChange = (currentPage, pageSize) => {
            console.log(`currentPage=${currentPage}, pageSize=${pageSize}`);
        }
        return {
            handleChange
        };
    },
});
</script>