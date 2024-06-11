<template>
    <div class="card-wrapper">
        <FCard header="这里是标题">
            卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
            <template #footer>
                <FButton size="small">操作</FButton>
                <FButton size="small" style="margin-left: 8px;">按钮</FButton>
            </template>
        </FCard>
    </div>
</template>

<style scoped>
.card-wrapper {
    width: 350px;
}
</style>
