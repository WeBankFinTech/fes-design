<template>
<div class="virtual-container">
    <FVirtualList class="list-horizontal scroll-touch"
          :data-key="'id'"
          :data-sources="items"
          :estimate-size="110"
          :direction="'horizontal'"
          :wrap-class="'wrapper'"
          :item-class="'list-item-horizontal'"
        >
        <template #={source}>
            <div class="item-inner-horizontal" v-bind:style="{width: source.size + 'px'}">
                <div class="index"># {{ source.index }}</div>
                <div class="size">{{ source.size }}</div>
            </div>
        </template>
    </FVirtualList>
</div>
</template>

<script>
const TOTAL_COUNT = 100;
const sizes = [60, 80, 100, 150, 180]

const genUniqueId = (prefix) => {
  return `${prefix}$${Math.random().toString(16).substr(9)}`
}

const DataItems = []
let count = TOTAL_COUNT
while (count--) {
  const index = TOTAL_COUNT - count
  DataItems.push({
    index,
    id: genUniqueId(index),
    size: sizes[Math.floor(Math.random() * 5)]
  })
}

export default {
  name: 'Horizontal',
  data () {
    return {
      total: TOTAL_COUNT.toLocaleString(),
      items: DataItems,
      isShowView: true
    }
  },
}
</script>

<style lang="less">
.virtual-container {
    padding: 20px;
    margin-top: 20px;
}
.list-horizontal {
  width: 100%;
  height: 120px;
  overflow-x: auto;
  display: flex; 

  .wrapper {
    display: flex;
    flex-direction: row;
  }

  .list-item-horizontal {
    border-right: 2px solid rgb(255, 255, 255);
    background: rgba(83, 132, 255, 0.06) none repeat scroll 0% 0%;
  }
}
.item-inner-horizontal {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2em 0;
  .index {
    width: 100%;
    text-align: center;
  }
  .size {
    text-align: right;
    color: darkgray;
    font-size: 16px;
  }
}
</style>