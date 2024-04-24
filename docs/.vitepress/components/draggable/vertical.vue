<template>
    <FForm labelWidth="100px">
        <FFormItem label="是否禁用:">
            <FSwitch v-model="disabled" />
        </FFormItem>
    </FForm>
    <FSpace>
        <FButton type="primary" @click="doInsertItem">动态新增</FButton>
        <FButton type="primary" @click="doDeleteItem">动态删减</FButton>
        <FButton type="primary" @click="doRandomUpdateItem"> 随机更新 </FButton>
    </FSpace>

    <FDivider />

    <div class="container">
        <FDraggable
            v-model="list"
            :beforeDragend="beforeDragend"
            :disabled="disabled"
        >
            <template #default="{ item }">
                <div class="sort-item">{{ item }}</div>
            </template>
        </FDraggable>
    </div>
</template>

<script>
import { ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';

let seed = 6;
export default {
    setup() {
        const disabled = ref(false);

        const list = ref([1, 2, 3, 4, 5]);
        const doInsertItem = () => {
            list.value.push(`new item ${seed++}`);
        };
        const doDeleteItem = () => {
            list.value.splice(list.value.length - 1, 1);
        };

        const doRandomUpdateItem = () => {
            let op = Number.parseInt(Math.random() * 10) % 2;
            let index = Number.parseInt(Math.random() * 100) % list.value.length;
            if (list.value.length === 0) {
                op = 0;
                index = 0;
            }
            if (op === 0) {
                // 新增
                FMessage.success(`在位置${index + 1}新增`);
                list.value = list.value
                    .slice(0, index)
                    .concat([`new item ${seed++}`])
                    .concat(list.value.slice(index));
            } else {
                // 删除
                FMessage.success(`在位置${index + 1}删除`);
                list.value.splice(index, 1);
            }
        };

        const beforeDragend = () => {
            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         reject();
            //     }, 3000);
            // });
            return true;
        };

        return {
            disabled,
            list,
            doInsertItem,
            doDeleteItem,
            doRandomUpdateItem,
            beforeDragend,
        };
    },
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
