<template>
    <div class="fit-demo">
        <div v-for="fit in fits" :key="fit" class="block">
            <span class="demonstration">{{ fit }}</span>
            <FImage style="width: 100px; height: 100px" :src="url" :fit="fit">
            </FImage>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const fits = ref(['fill', 'contain', 'cover', 'none', 'scale-down']);
        const url = ref('/images/6.jpeg');
        return {
            url,
            fits,
        };
    },
};
</script>
<style>
.fit-demo {
    display: flex;
}
.fit-demo .block {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-right: solid 1px #dcdfe6;
}
.fit-demo .block:last-child {
    border-right: none;
}
</style>
