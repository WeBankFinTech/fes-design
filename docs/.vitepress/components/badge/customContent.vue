<template>
    <FBadge>
        <template #content>
            <ClockCircleOutlined />
        </template>
        <a href="#" class="example" />
    </FBadge>
    <FBadge>
        <template #content>
            <span>Good</span>
        </template>
        <a href="#" class="example" />
    </FBadge>
    <FBadge value="New">
        <a href="#" class="example" />
    </FBadge>
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
