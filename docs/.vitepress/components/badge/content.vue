<template>
    <FSpace>
        <FBadge type="primary">
            <template #content>
                <ClockCircleOutlined />
            </template>
            <FButton> Primary </FButton>
        </FBadge>
        <FBadge type="success">
            <template #content>
                <span>Good</span>
            </template>
            <FButton> Success </FButton>
        </FBadge>
        <FBadge value="继续努力">
            <FButton> Danger </FButton>
        </FBadge>
    </FSpace>
</template>

<style>
.example {
    width: 42px;
    height: 42px;
    border-radius: 4px;
    background: #eee;
    display: inline-block;
    vertical-align: middle;
}
</style>
