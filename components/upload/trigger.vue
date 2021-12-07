<template>
    <div :class="prefixCls" @click="handleClick">
        <slot>
            <Button :class="`${prefixCls}-trigger-default`" :disabled="disabled">
                <template v-slot:icon>
                    <UploadOutlined />
                </template>上传文件
            </Button>
        </slot>
        <input
            ref="inputRef"
            :class="`${prefixCls}-input`"
            type="file"
            :name="name"
            :multiple="multiple"
            :accept="acceptStr"
            @change="handleChange"
        />
    </div>
</template>
<script>
import {
    defineComponent, inject, computed,
} from 'vue';
import { key } from './const';
import Button from '../button';
import UploadOutlined from '../icon/UploadOutlined';

export default defineComponent({
    components: {
        Button,
        UploadOutlined,
    },
    setup() {
        const {
            name,
            multiple,
            accept,
            disabled,
            prefixCls,
            onUploadFiles,
            inputRef,
        } = inject(key);

        const acceptStr = computed(() => accept.value.join(','));

        const handleClick = () => {
            if (disabled.value) return;
            inputRef.value.click();
        };
        const handleChange = (e) => {
            const files = e.target.files;
            if (!files) return;
            onUploadFiles(files);
        };
        return {
            prefixCls,
            acceptStr,
            handleClick,
            handleChange,
            inputRef,
            disabled,
            name,
            multiple,
        };
    },
});
</script>
