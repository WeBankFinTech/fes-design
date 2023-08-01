<template>
    <div :class="`${prefixCls}-list`">
        <div
            v-for="file in uploadFiles"
            :key="file.uid"
            :class="[`${prefixCls}-list-item`, `is-${file.status}`]"
        >
            <div :class="`${prefixCls}-list-name-wrapper`">
                <slot name="file" :file="file">
                    <FileOutlined />
                    <div :class="`${prefixCls}-list-name`">{{ file.name }}</div>
                </slot>
                <div
                    v-if="file.status === 'uploading'"
                    :class="`${prefixCls}-list-progress`"
                >
                    <span
                        :class="`${prefixCls}-list-progress-inner`"
                        :style="{ width: file.percentage + '%' }"
                    ></span>
                </div>
            </div>
            <div :class="`${prefixCls}-list-icons`">
                <CloseCircleFilled
                    v-if="!disabled"
                    :class="`${prefixCls}-list-icons-close`"
                    @click="onRemove(null, file)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import FileOutlined from '../icon/FileOutlined';
import { key } from './const';

const { disabled, prefixCls, uploadFiles, onRemove } = inject(key);
</script>
