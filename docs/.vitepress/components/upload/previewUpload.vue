<template>
    <FUpload
        action="https://run.mocky.io/v3/2d9d9844-4a46-4145-8f57-07e13768f565"
        multiple
        :multipleLimit="4"
        :fileList="fileList"
        :accept="accept"
        :beforeUpload="beforeUpload"
        @change="change"
        @remove="remove"
        @success="success"
        @error="error"
        @exceed="exceed"
        @progress="progress"
    >
        <template #tip>
            <div class="f-upload__tip">
                只能上传 jpg/png 等图片文件，且不超过 5KB
            </div>
        </template>
        <template #file="{ file }">
            <FImage
                :name="file.name"
                :src="file.url"
                preview
                hide-on-click-modal
                style="cursor: pointer"
            >
                {{ file.name }}
            </FImage>
        </template>
    </FUpload>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const fileList = ref([
            {
                uid: '1',
                name: 'xxx.png',
                status: 'done',
                response: 'Server Error 500', // custom error message to show
                url: '/images/1.jpeg',
            },
        ]);

        const accept = ['image/*'];
        const change = (param) => {
            console.log('[upload.previewUpload] [change] param:', param);
        };
        const remove = (param) => {
            console.log('[upload.previewUpload] [remove] param:', param);
        };
        const success = (param) => {
            console.log('[upload.previewUpload] [success] param:', param);
        };
        const error = (param) => {
            console.log('[upload.previewUpload] [error] param:', param);
        };
        const exceed = (param) => {
            console.log('[upload.previewUpload] [exceed] param:', param);
        };
        const progress = (param) => {
            console.log('[upload.previewUpload] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.previewUpload] [beforeUpload] file:', file);
            if (file.size > 500 * 1024) {
                console.log(
                    '[upload.previewUpload] [beforeUpload] 超出5KB,无法上传!',
                );
                return false;
            }
            return true;
        };
        return {
            fileList,
            accept,
            change,
            remove,
            success,
            error,
            exceed,
            progress,
            beforeUpload,
        };
    },
};
</script>
<style>
.f-upload__tip {
    font-size: 12px;
    margin-top: 7px;
    color: #93949b;
}
</style>
