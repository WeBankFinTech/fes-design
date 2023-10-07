<template>
    <FUpload
        ref="uploadRef"
        v-model:fileList="fileList"
        action="https://run.mocky.io/v3/2d9d9844-4a46-4145-8f57-07e13768f565"
        :multipleLimit="1"
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
    </FUpload>
</template>
<script>
import { ref, nextTick } from 'vue';
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        const uploadRef = ref(null);

        const fileList = ref([]);

        const accept = ['image/*'];
        const change = (param) => {
            console.log('[upload.singleUpload] [change] param:', param);
        };
        const remove = (param) => {
            console.log(
                '[upload.singleUpload] [remove] param:',
                param,
                ' fileList.value:',
                fileList.value,
            );
        };
        const success = (param) => {
            console.log(
                '[upload.singleUpload] [success] param:',
                param,
                ' fileList.value:',
                fileList.value,
            );
        };
        const error = (param) => {
            fileList.value = fileList.value.filter(
                (file) => file.status !== 'error',
            );
            console.log(
                '[upload.singleUpload] [error] param:',
                param,
                ' fileList.value:',
                fileList.value,
            );
            FMessage.error('文件上传失败');
        };
        const exceed = async (param) => {
            console.log('[upload.singleUpload] [exceed] param:', param);
            uploadRef.value?.clearFiles();
            await nextTick();
            uploadRef.value?.addFile(param.files[0]);
        };
        const progress = (param) => {
            console.log('[upload.singleUpload] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.singleUpload] [beforeUpload] file:', file);
            if (file.size > 50 * 1024) {
                console.log(
                    '[upload.singleUpload] [beforeUpload] 超出5KB,无法上传!',
                );
                FMessage.warning('超出50KB,无法上传!');
                return false;
            }
            return true;
        };
        return {
            uploadRef,
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
