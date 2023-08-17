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
        <FUploadDragger> 点击或者拖拽文件到此区域 </FUploadDragger>
    </FUpload>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const fileList = ref([]);

        const accept = ['image/*'];
        const change = (param) => {
            console.log('[upload.drag] [change] param:', param);
        };
        const remove = (param) => {
            console.log('[upload.drag] [remove] param:', param);
        };
        const success = (param) => {
            console.log('[upload.drag] [success] param:', param);
        };
        const error = (param) => {
            console.log('[upload.drag] [error] param:', param);
        };
        const exceed = (param) => {
            console.log('[upload.drag] [exceed] param:', param);
        };
        const progress = (param) => {
            console.log('[upload.drag] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.drag] [beforeUpload] file:', file);
            if (file.size > 500 * 1024) {
                console.log('[upload.drag] [beforeUpload] 超出5KB,无法上传!');
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
