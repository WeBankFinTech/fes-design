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
    const files = (e.target as any).files;
    if (!files) return;
    onUploadFiles(files);
};

const { t } = useLocale();
</script>
