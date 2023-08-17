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
        <div>点击我就能上传</div>
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
                url: 'http://www.baidu.com/xxx.png',
            },
            {
                uid: '2',
                name: 'yyy.png',
                status: 'done',
                url: 'http://www.baidu.com/yyy.png',
            },
            {
                uid: '3',
                name: 'zzz.png',
                status: 'error',
                response: 'Server Error 500', // custom error message to show
                url: 'http://www.baidu.com/zzz.png',
            },
        ]);

        const accept = ['image/*'];
        const change = (param) => {
            console.log('[upload.default] [change] param:', param);
        };
        const remove = (param) => {
            console.log('[upload.default] [remove] param:', param);
        };
        const success = (param) => {
            console.log('[upload.default] [success] param:', param);
        };
        const error = (param) => {
            console.log('[upload.default] [error] param:', param);
        };
        const exceed = (param) => {
            console.log('[upload.default] [exceed] param:', param);
        };
        const progress = (param) => {
            console.log('[upload.default] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.default] [beforeUpload] file:', file);
            if (file.size > 500 * 1024) {
                console.log(
                    '[upload.default] [beforeUpload] 超出5KB,无法上传!',
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
