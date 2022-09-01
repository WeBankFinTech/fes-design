<template>
    <div class="container" style="display: flex; justify-content: space-around">
        <div v-drag:[dragArg].droppable="mlist">
            <div v-for="i in mlist" :key="i" class="sort-item2">
                <span>{{ i }}</span>
            </div>
        </div>
        <div v-drag:[dragArg2].droppable="mlist2">
            <div v-for="i in mlist2" :key="i" class="sort-item2">
                <span>{{ i }}</span>
            </div>
        </div>
        <div v-drag.droppable="mlist3">
            <div v-for="i in mlist3" :key="i" class="sort-item2">
                <span>{{ i }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';
export default {
    setup() {
        const mlist = ref([]);
        setTimeout(() => {
            mlist.value = [1, 2, 3, 4];
        }, 1000);
        const mlist2 = ref([5, 6, 7]);
        const mlist3 = ref([8, 9]);

        const dragArg = {
            onDragStart(event, item, setting) {
                console.log('handleDargStart', event, item, setting);
            },
            onDragEnd(event, item, setting) {
                console.log('handleDargEnd', event, item, setting);
            },
            beforeDragEnd(item, start, end) {
                console.log('beforeDragEnd', item, start, end);
                FMessage.error('拖拽阻止！');
                return false;
            },
        };

        const dragArg2 = {
            onDragStart(event, item, setting) {
                console.log('handleDargStart2', event, item, setting);
            },
            onDragEnd(event, item, setting) {
                console.log('handleDargEnd2', event, item, setting);
            },
            beforeDragEnd(item, start, end) {
                console.log('beforeDragEnd2', item, start, end);
                FMessage.error('拖拽阻止！');
                return false;
            },
        };

        return {
            mlist,
            mlist2,
            mlist3,
            dragArg,
            dragArg2,
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
    width: 150px;
}
</style>
