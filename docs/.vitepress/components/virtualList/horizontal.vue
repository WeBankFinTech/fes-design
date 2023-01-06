<template>
    <FVirtualList
        class="list-horizontal"
        :dataKey="'id'"
        :dataSources="items"
        :estimateSize="110"
        direction="horizontal"
    >
        <template #default="{ source }">
            <div
                class="item-inner-horizontal"
                :style="{ width: source.size + 'px' }"
            >
                <div class="index"># {{ source.index }}</div>
                <div class="size">{{ source.size }}</div>
            </div>
        </template>
    </FVirtualList>
</template>

<script>
const TOTAL_COUNT = 100;
const sizes = [60, 80, 100, 150, 180];

const genUniqueId = (prefix) => {
    return `${prefix}$${Math.random().toString(16).substr(9)}`;
};

const DataItems = [];
let count = TOTAL_COUNT;
while (count--) {
    const index = TOTAL_COUNT - count;
    DataItems.push({
        index,
        id: genUniqueId(index),
        size: sizes[Math.floor(Math.random() * 5)],
    });
}

export default {
    name: 'Horizontal',
    setup() {
        return {
            total: TOTAL_COUNT.toLocaleString(),
            items: DataItems,
            isShowView: true,
        };
    },
};
</script>

<style>
.list-horizontal {
    width: 100%;
    height: 120px;
    overflow-x: auto;
}
.item-inner-horizontal {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 2em 0;
}
.item-inner-horizontal .index {
    width: 100%;
    text-align: center;
}
.item-inner-horizontal .size {
    text-align: right;
    color: darkgray;
    font-size: 16px;
}
</style>
