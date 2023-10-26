<template>
    <FSpace vertical>
        <FScrollbar ref="scrollbarRefEl" height="200px" style="width: 100%">
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
for (let i = 0; i < 50; ++i) {
    values.value.push(i);
}

const scrollbarRefEl = ref();
</script>

<style scoped>
.scroll-list {
    margin: 0;
    padding: 0;
}
.scroll-list > .scroll-item {
    height: 36px;
    background: rgba(83, 132, 255, 0.06);
    border-bottom: 2px solid #fff;
}
.scroll-list > .scroll-item + .scroll-item {
    margin-top: 8px;
}
</style>
