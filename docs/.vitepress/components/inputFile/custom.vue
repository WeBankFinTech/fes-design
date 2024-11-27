<template>
    <FForm layout="inline" :inlineItemWidth="120">
        <FFormItem label="多选:">
            <FSwitch v-model="multiple" />
        </FFormItem>
        <FFormItem label="禁用:">
            <FSwitch v-model="disabled" />
        </FFormItem>
    </FForm>

    <FDivider />

    <FInputFile
        v-model="fileList"
        :multiple="multiple"
        :disabled="disabled"
        :accept="['image/*']"
        @change="handleChange"
    >
        <FButton type="info" :disabled="disabled">
            <template #icon>
                <UploadOutlined />
            </template>
            请选择文件
        </FButton>

        <template #fileList="{ files }">
            <div class="file-list">
                <div
                    v-for="file in files"
                    :key="file.uid"
                    class="file-list-item"
                >
                    <div class="file-list-name-wrapper">
                        <slot name="file" :file="file">
                            <FileOutlined />
                            <div class="file-list-name">{{ file.name }}</div>
                        </slot>
                    </div>
                    <div class="file-list-icon">
                        <CloseCircleFilled
                            v-if="!disabled"
                            class="file-list-icon-close"
                            @click="() => handleRemoveFile(file.uid)"
                        />
                    </div>
                </div>
            </div>
        </template>
    </FInputFile>
</template>

<script setup>
import { ref } from 'vue';

const multiple = ref(true);
const disabled = ref(false);
const fileList = ref([]);

const handleChange = (files) =>
    console.log('[inputFile.customSelect] [handleChange] files:', files, ', fileList:', fileList.value);

const handleRemoveFile = (uid) => {
    const targetIndex = fileList.value.findIndex((file) => file.uid === uid);
    fileList.value.splice(targetIndex, 1);
};
</script>

<style scoped lang="less">
.file-list {
    width: 100%;
    color: var(--f-sub-head-color);
    font-size: var(--f-font-size-base);
    line-height: 24px;
    &-item {
        display: flex;
        align-items: center;
        margin-top: 4px;
        border-radius: var(--f-border-radius-sm);
        &:first-child {
            margin-top: 8px;
        }
        &:last-child {
            margin-bottom: 8px;
        }
        .file-list-name-wrapper {
            display: flex;
            flex: 1;
            align-items: center;
            .file-list-name {
                margin-left: 6px;
            }
        }
        .file-list-icon {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 40px;
            color: var(--f-text-color-secondary);
            &-close {
                display: none;
                padding: 2px;
            }
        }
        &:hover {
            background-color: var(--f-hover-color-light);
            .file-list-icon {
                &-close {
                    display: inline-block;
                }
            }
        }
    }
}

:deep(.fes-input-file .fes-input-file-visible-content) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .fes-input-file-file-list {
        width: 100%;
        max-width: 500px;
    }
}
</style>
