<template>
    <FSpace>
        <FButton type="primary"> <SearchOutlined />查询 </FButton>
        <FDivider vertical />
        <FButton>
            <template #icon>
                <DownloadOutlined />
            </template>
            下载
        </FButton>
    </FSpace>
</template>

<script setup>
import { DownloadOutlined, SearchOutlined } from '@fesjs/fes-design/icon';
</script>
