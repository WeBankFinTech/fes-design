<template>
    <div class="lazy-load-wrapper">
        <FScrollbar containerClass="lazy-load-wrapper">
            <slot>
                <FImage
                    v-for="url in lazyUrls"
                    :key="url"
                    :src="url"
                    lazy
                    style="min-height: 200px"
                ></FImage>
            </slot>
        </FScrollbar>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const lazyUrls = ref([
            '/images/1.jpeg',
            '/images/2.jpeg',
            '/images/3.jpeg',
            '/images/4.jpeg',
            '/images/5.jpeg',
            '/images/6.jpeg',
        ]);
        return {
            lazyUrls,
        };
    },
};
</script>
<style>
.lazy-load-wrapper {
    width: 600px;
    height: 400px;
}
</style>
