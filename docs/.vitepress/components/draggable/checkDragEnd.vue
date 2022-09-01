<template>
    <div class="container" style="display: flex; justify-content: space-around">
        <FDraggable
            v-model="mlist"
            droppable
            style="height: 300px; width: 200px"
            :beforeDragend="beforeDragend"
            @dragstart="handleDargStart"
            @dragend="handleDargEnd"
        >
            <template #="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
        <FDraggable
            v-model="mlist2"
            droppable
            style="height: 300px; width: 200px"
            :beforeDragend="beforeDragend2"
            @dragstart="handleDargStart2"
            @dragend="handleDargEnd2"
        >
            <template #="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
        <FDraggable
            v-model="mlist3"
            droppable
            style="height: 300px; width: 200px"
        >
            <template #="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
    </div>
</template>

<script>
import { ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';
export default {
    setup() {
        const mlist = ref([1, 2, 3, 4]);
        const mlist2 = ref([5, 6, 7]);
        const mlist3 = ref([8, 9]);

        function handleDargStart(event, item, setting) {
            console.log('handleDargStart', event, item, setting);
        }
        function handleDargStart2(event, item, setting) {
            console.log('handleDargStart2', event, item, setting);
        }
        function handleDargEnd(event, item, setting) {
            console.log('handleDargEnd', event, item, mlist, setting);
        }
        function handleDargEnd2(event, item, setting) {
            console.log('handleDargEnd2', event, item, setting);
        }

        const beforeDragend = (drag, drop) => {
            console.log('beforeDragend', drag, drop);
            FMessage.error('拖拽阻止！');
            return false;
        };

        const beforeDragend2 = (drag, drop) => {
            console.log('beforeDragend2', drag, drop);
            FMessage.error('拖拽阻止！');
            return false;
        };

        return {
            mlist,
            mlist2,
            mlist3,
            handleDargStart,
            handleDargStart2,
            handleDargEnd,
            handleDargEnd2,
            beforeDragend,
            beforeDragend2,
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
