<template>
    <div class="container" style="display: flex; justify-content: space-around">
        <div v-drag.droppable="vmlist">
            <div v-for="i in vmlist" :key="i" class="sort-item2">
                <span>{{ i }}</span>
            </div>
        </div>
        <div v-drag.droppable="vmlist2">
            <div v-for="i in vmlist2" :key="i" class="sort-item2">
                <span>{{ i }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const vmlist = ref([1, 2, 3, 4]);
        const vmlist2 = ref([5, 6, 7, 8, 9]);

        return {
            vmlist,
            vmlist2,
        };
    },
};
</script>

<style scoped>
.container {
    background: #eee;
    padding: 50px 20px;
}

.sort-item2 {
    line-height: 50px;
    background: #fff;
    margin: 1px 0;
    padding-left: 20px;
    width: 200px;
}
</style>
