<template>
    <FImage :width="200" height="200px" :src="url">
        <template #placeholder>
            <div class="image-slot">
                <div class="image-slot">
                    Loading<span class="dot">...</span>
                </div>
            </div>
        </template>
    </FImage>
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
