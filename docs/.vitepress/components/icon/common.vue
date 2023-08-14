<template>
    <FSpace>
        <FButton type="primary"> <SearchOutlined />查询 </FButton>
        <FDivider vertical></FDivider>
        <FButton>
            <template #icon>
                <DownloadOutlined />
            </template>
            下载
        </FButton>
    </FSpace>
</template>

<script setup>
import { SearchOutlined, DownloadOutlined } from '@fesjs/fes-design/icon';
</script>
