<template>
    <FSpace>
        <FBadge :value="val" type="primary">
            <a href="#" class="example" />
        </FBadge>
        <FBadge :value="val" type="success">
            <a href="#" class="example" />
        </FBadge>
        <FBadge :value="val" type="warning">
            <a href="#" class="example" />
        </FBadge>
        <FBadge :value="val" type="danger">
            <a href="#" class="example" />
        </FBadge>
        <FButton @click="onClick">+1</FButton>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const val = ref(9);

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
