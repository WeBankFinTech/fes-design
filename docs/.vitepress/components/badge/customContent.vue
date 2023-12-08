<template>
    <FBadge>
        <template #count>
            <ClockCircleOutlined />
        </template>
        <a href="#" class="example" />
    </FBadge>
    <FBadge>
        <template #count>
            <span>Good</span>
        </template>
        <a href="#" class="example" />
    </FBadge>
    <FBadge count="New">
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
