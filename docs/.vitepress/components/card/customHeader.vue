<template>
    <div class="card-wrapper">
        <FCard>
            <template #header>
                <div class="card-header">
                    <span>这里是自定义标题</span>
                    <FButton type="link">操作</FButton>
                </div>
            </template>
            卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
        </FCard>
    </div>
</template>

<style scoped>
.card-wrapper {
    width: 350px;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
