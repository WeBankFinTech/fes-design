<template>
    <div class="container">
        <div v-drag="vhlist" class="horizontal">
            <div v-for="i in vhlist" :key="i" class="sort-horizontal-item">
                <span>{{ i }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const vhlist = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        return {
            vhlist,
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
