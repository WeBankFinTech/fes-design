<template>
    <FUpload
        v-model:fileList="fileList"
        action="https://run.mocky.io/v3/cbe5b01d-8a6d-46f9-a5e4-6c70e45ba6d0"
        multiple
        :multipleLimit="4"
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
import { ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        const fileList = ref([]);

        const accept = ['image/*'];
        const change = (param) => {
            console.log('[upload.common] [change] param:', param);
        };
        const remove = (param) => {
            console.log(
                '[upload.common] [remove] param:',
                param,
                ' fileList.value:',
                fileList.value,
            );
        };
        const success = (param) => {
            console.log(
                '[upload.common] [success] param:',
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
                '[upload.common] [error] param:',
                param,
                ' fileList.value:',
                fileList.value,
            );
            FMessage.error('文件上传失败');
        };
        const exceed = (param) => {
            console.log('[upload.common] [exceed] param:', param);
            FMessage.warning('文件上传超限');
        };
        const progress = (param) => {
            console.log('[upload.common] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.common] [beforeUpload] file:', file);
            if (file.size > 50 * 1024) {
                console.log('[upload.common] [beforeUpload] 超出5KB,无法上传!');
                FMessage.warning('超出50KB,无法上传!');
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
