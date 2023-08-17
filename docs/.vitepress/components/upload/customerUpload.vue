<template>
    <FUpload
        action="https://run.mocky.io/v3/2d9d9844-4a46-4145-8f57-07e13768f565"
        multiple
        :multipleLimit="4"
        :fileList="fileList"
        :accept="accept"
        :beforeUpload="beforeUpload"
        :httpRequest="customRequest"
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
            console.log('[upload.customerUpload] [change] param:', param);
        };
        const remove = (param) => {
            console.log('[upload.customerUpload] [remove] param:', param);
        };
        const success = (param) => {
            console.log('[upload.customerUpload] [success] param:', param);
        };
        const error = (param) => {
            console.log('[upload.customerUpload] [error] param:', param);
        };
        const exceed = (param) => {
            console.log('[upload.customerUpload] [exceed] param:', param);
        };
        const progress = (param) => {
            console.log('[upload.customerUpload] [progress] param:', param);
        };
        const beforeUpload = async (file) => {
            console.log('[upload.customerUpload] [beforeUpload] file:', file);
            if (file.size > 500 * 1024) {
                console.log(
                    '[upload.customerUpload] [beforeUpload] 超出5KB,无法上传!',
                );
                return false;
            }
            return true;
        };

        const customRequest = async (options) => {
            const formData = new FormData();
            formData.append('file', options.file);
            if (options.data) {
                Object.keys(options.data).forEach((key) =>
                    formData.append(key, options.data[key]),
                );
            }
            const controller = new AbortController();
            try {
                let res = await fetch(options.action, {
                    headers: options.headers,
                    credentials: options.withCredentials ? 'include' : 'omit',
                    body: formData,
                    signal: controller.signal,
                });
                if (options.transformResponse) {
                    res = options.transformResponse(res);
                }
                //  调用 onProgress 告知 upload 内部上传进度，这里只是 demo 实际请通知具体上传进度
                options.onProgress({
                    percent: 100,
                });
                // 调用 onSuccess 告知 upload 内部上传响应结果
                options.onSuccess(res);
            } catch (e) {
                // 调用 onSuccess 告知 upload 内部上传失败情况
                options.onError(e);
            }

            return {
                // 返回取消请求的方法，非必需，但建议有
                abort: () => controller.abort(),
            };
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
            customRequest,
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
