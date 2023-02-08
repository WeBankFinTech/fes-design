<template>
    <FSpace ref="rootRef">
        <FImage
            style="width: 200px; height: 200px"
            :src="url"
            fit="contain"
            preview
            download
            hide-on-click-modal
            name="我是图片"
        >
        </FImage>

        <FImage
            :src="url"
            preview
            hide-on-click-modal
            :previewContainer="getContainer"
        >
            <FButton type="link">自定义展示内容.png</FButton>
        </FImage>
    </FSpace>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const url = ref('/images/1.jpeg');
        const rootRef = ref(null);
        const getContainer = () => rootRef.value?.$el;
        return {
            url,
            getContainer,
            rootRef,
        };
    },
};
</script>
