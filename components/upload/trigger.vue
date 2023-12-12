<template>
    <div :class="prefixCls" @click="handleClick">
        <slot>
            <Button
                :class="`${prefixCls}-trigger-default`"
                :disabled="disabled"
            >
                <template #icon> <UploadOutlined /> </template>
                {{ t('upload.btnText') }}
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
            @click.stop
        />
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import Button from '../button/button';
import UploadOutlined from '../icon/UploadOutlined';
import { useLocale } from '../config-provider/useLocale';
import { key } from './const';

const { name, multiple, accept, disabled, prefixCls, onUploadFiles, inputRef } =
    inject(key);

const acceptStr = computed(() => accept.value.join(','));

const handleClick = () => {
    if (disabled.value) return;
    inputRef.value.click();
};
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;

    const files = target.files;
    if (!files) return;
    onUploadFiles(files);

    // 若不重置，重复选择相同文件，change 事件可能不触发
    target.value = null;
};

const { t } = useLocale();
</script>
