<template>
    <FSpace>
        <FBadge type="primary" class="item">
            <template #content>
                <ClockCircleOutlined />
            </template>
            <FButton> Primary </FButton>
        </FBadge>
        <FBadge type="success" class="item">
            <template #content>
                <span>Good</span>
            </template>
            <FButton> Success </FButton>
        </FBadge>
        <FBadge value="继续努力" class="item">
            <FButton> Danger </FButton>
        </FBadge>
    </FSpace>
</template>

<style>
.item {
    margin-right: 20px;
}
</style>
