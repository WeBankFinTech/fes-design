<template>
    <FSpace>
        <FBadge :count="val">
            <a href="#" class="example" />
        </FBadge>
        <FButton @click="onClick">点击+1</FButton>
    </FSpace>

    <FSpace>
        <FBadge :count="0">
            <a href="#" class="example" />
        </FBadge>
        <FBadge :count="0" showZero>
            <a href="#" class="example" />
        </FBadge>
        <FBadge dot>
            <a href="#" class="example" />
        </FBadge>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref(0);

        const onClick = () => {
            val.value += 1;
        };
        return {
            val,
            onClick,
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
