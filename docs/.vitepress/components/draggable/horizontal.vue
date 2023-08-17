<template>
    <div class="container">
        <FDraggable
            v-model="hlist"
            class="horizontal"
            :beforeDragend="beforeDragend"
        >
            <template #default="{ item }">
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

        const beforeDragend = (item, index) => {
            console.log(
                '[draggable.horizontal] [beforeDragend] item:',
                item,
                ' index:',
                index,
            );
            return true;
        };

        return {
            hlist,
            beforeDragend,
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
