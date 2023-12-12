<template>
    <FSpace>
        <FBadge :value="100">
            <a href="#" class="example" />
        </FBadge>
    </FSpace>
    <FSpace>
        <FBadge :value="val" :max="9">
            <a href="#" class="example" />
        </FBadge>
        <FButton @click="add">+1</FButton>
        <FButton @click="reduce">-1</FButton>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref(0);

        const add = () => {
            val.value += 1;
        };

        const reduce = () => {
            val.value -= 1;
        };
        return {
            val,
            add,
            reduce,
        };
    },
};
</script>

<style>
.example {
    width: 42px;
    height: 42px;
    border-radius: 4px;
    background: #eee;
    display: inline-block;
    vertical-align: middle;
}
</style>
