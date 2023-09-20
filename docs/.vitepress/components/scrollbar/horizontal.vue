<template>
    <FSpace vertical>
        <FScrollbar ref="scrollbarRefEl" style="width: 100%">
            <ul class="scroll-ul">
                <li v-for="(item, index) in values" :key="index">
                    {{ item }}
                </li>
            </ul>
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
.scroll-ul {
    list-style-type: none;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.scroll-ul > li {
    flex-shrink: 0;
    width: 36px;
    background: rgba(83, 132, 255, 0.06);
    list-style-type: none;
    border-bottom: 2px solid #fff;
}
.scroll-ul > li::before {
    display: none;
}
</style>
