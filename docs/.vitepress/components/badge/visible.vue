<template>
    <FBadge :value="9" :hidden="visible">
        <a href="#" class="example" />
    </FBadge>
    <FButton @click="changeVisible">显示/隐藏 徽标</FButton>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const visible = ref(false);

        const changeVisible = () => {
            visible.value = !visible.value;
        };
        return {
            visible,
            changeVisible,
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
