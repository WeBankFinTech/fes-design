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
            onDragstart(event, item, setting) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [onDragstart] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            onDragend(event, item, setting) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [onDragend] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            beforeDragend(item, start, end) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [beforeDragend] item:',
                    item,
                    ' start:',
                    start,
                    ' end:',
                    end,
                );
                FMessage.error('拖拽阻止！');
                return false;
            },
        };

        const dragArg2 = {
            onDragstart(event, item, setting) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [onDragstart] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            onDragend(event, item, setting) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [onDragend] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            beforeDragend(item, start, end) {
                console.log(
                    '[draggable.instructionCheckDragEnd] [beforeDragend] item:',
                    item,
                    ' start:',
                    start,
                    ' end:',
                    end,
                );
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
