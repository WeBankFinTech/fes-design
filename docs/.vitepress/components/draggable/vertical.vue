<template>
    <div class="container">
        <FDraggable v-model="list">
            <template #="{ item }">
                <div class="sort-item">{{ item }}</div>
            </template>
        </FDraggable>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const list = ref([1, 2, 3, 4, 5]);
        return {
            list
        };
    }
};
</script>

<style>
.fes-draggable-item::before {
    display: none;
}
</style>

<style scoped>
.container {
    background: #eee;
    padding: 50px 20px;
}
.sort-item {
    line-height: 50px;
    background: #fff;
    margin: 1px 0;
    padding-left: 20px;
}
</style>
