<template>
    <FImage style="width: 200px; height: 200px" :src="url" fit="contain" preview :zIndex="3000" :hide-on-click-modal="true"> </FImage>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const url = ref('/images/1.jpeg');
        return {
            url,
        };
    },
};
</script>
<style lang="less"></style>
