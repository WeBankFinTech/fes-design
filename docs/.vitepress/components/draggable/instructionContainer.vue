<template>
    <div class="container" style="display: flex; justify-content: space-around">
        <div>
            <span class="words">禁止拖拽、不可放置</span>
            <div v-drag:[dragArg].disabled="mlist" class="draggable-wrapper">
                <div v-for="i in mlist" :key="i" class="sort-item2">
                    <span>{{ i }}</span>
                </div>
            </div>
        </div>
        <div>
            <span class="words">可拖拽、可放置</span>
            <div v-drag:[dragArg2].droppable="mlist2" class="draggable-wrapper">
                <div v-for="i in mlist2" :key="i" class="sort-item2">
                    <span>{{ i }}</span>
                </div>
            </div>
        </div>
        <div>
            <span class="words">可拖拽、不可放置</span>
            <div v-drag="mlist3" class="draggable-wrapper">
                <div v-for="i in mlist3" :key="i" class="sort-item2">
                    <span>{{ i }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const disableds = ref([]);
        const droppables = ref(['left', 'center', 'right']);

        const mlist = ref([1, 2, 3, 4]);
        const mlist2 = ref([5, 6, 7]);
        const mlist3 = ref([8, 9]);

        const dragArg = {
            onDragstart(event, item, setting) {
                console.log(
                    '[draggable.instructionContainer] [onDragstart] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            onDragend(event, item, setting) {
                console.log(
                    '[draggable.instructionContainer] [onDragend] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
        };

        const dragArg2 = {
            onDragstart(event, item, setting) {
                console.log(
                    '[draggable.instructionContainer] [onDragstart] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
            onDragend(event, item, setting) {
                console.log(
                    '[draggable.instructionContainer] [onDragend] event:',
                    event,
                    ' item:',
                    item,
                    ' setting:',
                    setting,
                );
            },
        };

        return {
            disableds,
            droppables,
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
    padding: 30px 20px 50px;
    display: flex;
    justify-content: space-around;
}

.words {
    display: block;
    margin-bottom: 10px;
}

.draggable-wrapper {
    height: 300px;
    width: 200px;
    overflow: auto;
    border: 1px dashed #ccc;
    box-sizing: border-box;
}

.sort-item2 {
    line-height: 50px;
    background: #fff;
    margin: 1px 0;
    padding-left: 20px;
}
</style>
