<template>
    <FSpace vertical>
        <FScrollbar style="width: 100%">
            <ul class="scroll-ul">
                <li v-for="(item, index) in vals" :key="index">
                    {{ item }}
                </li>
            </ul>
        </FScrollbar>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const vals = ref([]);
        for (let i = 0; i < 100; ++i) {
            vals.value.push(i);
        }
        return {
            vals,
        };
    },
};
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
