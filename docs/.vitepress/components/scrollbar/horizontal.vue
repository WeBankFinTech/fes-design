<template>
    <FSpace vertical>
        <FScrollbar ref="scrollbarRefEl" style="width: 100%">
            <div class="scroll-list">
                <div
                    v-for="(item, index) in values"
                    :key="index"
                    class="scroll-item"
                >
                    {{ item }}
                </div>
            </div>
        </FScrollbar>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const values = ref([]);
for (let i = 0; i < 100; ++i) {
    values.value.push(i);
}

const scrollbarRefEl = ref();
</script>

<style scoped>
.scroll-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.scroll-list > .scroll-item {
    flex-shrink: 0;
    width: 36px;
    text-align: center;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.scroll-list > .scroll-item + .scroll-item {
    margin-left: 8px;
}
</style>
