<template>
    <FSpace>
        <FImage
            style="width: 200px; height: 200px"
            :src="url"
            fit="contain"
            preview
            hide-on-click-modal
            name="我是图片"
        >
        </FImage>

        <FImage :src="url" preview hide-on-click-modal>
            <FButton type="link">自定义展示内容.png</FButton>
        </FImage>
    </FSpace>
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
