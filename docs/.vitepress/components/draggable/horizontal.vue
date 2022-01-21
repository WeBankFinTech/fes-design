<template>
    <div class="container">
        <FDraggable v-model="hlist" class="horizontal">
            <template #="{ item }">
                <div class="sort-horizontal-item">{{ item }}</div>
            </template>
        </FDraggable>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const hlist = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

        return {
            hlist,
        };
    },
};
</script>

<style scoped>
.container {
    background: #eee;
    padding: 50px 20px;
}
.sort-horizontal-item {
    line-height: 100px;
    width: 100px;
    background: #fff;
    margin: 1px;
    text-align: center;
}

.horizontal {
    display: flex;
    flex-wrap: wrap;
}
</style>
