<template>
    <FSelect>
        <template #empty>
            <FEmpty :image-size="80" description="暂无数据" />
        </template>
    </FSelect>
</template>

<style scoped>
.fes-select {
    width: 200px;
}
</style>
