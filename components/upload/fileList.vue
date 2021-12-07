<template>
    <div :class="`${prefixCls}-list`">
        <div v-for="(file) in uploadFiles" :key="file.uid" :class="[`${prefixCls}-list-item`, `is-${file.status}`]">
            <div :class="`${prefixCls}-list-name-wrapper`">
                <FileOutlined />
                <div :class="`${prefixCls}-list-name`">{{file.name}}</div>
                <div v-if="file.status === 'uploading'" :class="`${prefixCls}-list-progress`">
                    <span :class="`${prefixCls}-list-progress-inner`" :style="{ width: file.percentage + '%' }"></span>
                </div>
            </div>
            <div :class="`${prefixCls}-list-icons`">
                <CloseCircleFilled v-if="!disabled" :class="`${prefixCls}-list-icons-close`" @click="onRemove(null, file)" />
            </div>
        </div>
    </div>
</template>
<script>
import {
    inject, defineComponent,
} from 'vue';
import { key } from './const';
import CloseCircleFilled from '../icon/CloseCircleFilled';
import FileOutlined from '../icon/FileOutlined';

export default defineComponent({
    components: {
        CloseCircleFilled,
        FileOutlined,
    },
    setup() {
        const {
            disabled,
            prefixCls,
            uploadFiles,
            onRemove,
        } = inject(key);

        return {
            prefixCls,
            uploadFiles,
            onRemove,
            disabled,
        };
    },
});
</script>
