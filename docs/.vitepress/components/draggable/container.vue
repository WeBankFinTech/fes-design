<template>
    <FForm labelWidth="120px">
        <FFormItem label="禁用容器:">
            <FCheckboxGroup
                v-model="disableds"
                :options="[
                    { label: '左侧容器', value: 'left' },
                    { label: '中间容器', value: 'center' },
                    { label: '右侧容器', value: 'right' },
                ]"
            />
        </FFormItem>
        <FFormItem label="可以放置容器:">
            <FCheckboxGroup
                v-model="droppables"
                :options="[
                    { label: '左侧容器', value: 'left' },
                    { label: '中间容器', value: 'center' },
                    { label: '右侧容器', value: 'right' },
                ]"
            />
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <div class="container">
        <FDraggable
            v-model="mlist"
            class="draggable-wrapper"
            :disabled="disableds.includes('left')"
            :droppable="droppables.includes('left')"
            @dragstart="handleDargStart"
            @dragend="handleDargEnd"
        >
            <template #default="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
        <FDraggable
            v-model="mlist2"
            class="draggable-wrapper"
            :disabled="disableds.includes('center')"
            :droppable="droppables.includes('center')"
            @dragstart="handleDargStart2"
            @dragend="handleDargEnd2"
        >
            <template #default="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
        <FDraggable
            v-model="mlist3"
            class="draggable-wrapper"
            :disabled="disableds.includes('right')"
            :droppable="droppables.includes('right')"
        >
            <template #default="{ item }">
                <div class="sort-item2">{{ item }}</div>
            </template>
        </FDraggable>
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

        function handleDargStart(event, item, setting) {
            console.log(
                '[draggable.container] [handleDargStart] event:',
                event,
                ' item:',
                item,
                ' setting:',
                setting,
            );
        }
        function handleDargStart2(event, item, setting) {
            console.log(
                '[draggable.container] [handleDargStart2] event:',
                event,
                ' item:',
                item,
                ' setting:',
                setting,
            );
        }
        function handleDargEnd(event, item, setting) {
            console.log(
                '[draggable.container] [handleDargEnd] event:',
                event,
                ' item:',
                item,
                ' setting:',
                setting,
            );
        }
        function handleDargEnd2(event, item, setting) {
            console.log(
                '[draggable.container] [handleDargEnd2] event:',
                event,
                ' item:',
                item,
                ' setting:',
                setting,
            );
        }

        return {
            disableds,
            droppables,
            mlist,
            mlist2,
            mlist3,
            handleDargStart,
            handleDargStart2,
            handleDargEnd,
            handleDargEnd2,
        };
    },
};
</script>

<style scoped>
.container {
    background: #eee;
    padding: 50px 20px;
    display: flex;
    justify-content: space-around;
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
