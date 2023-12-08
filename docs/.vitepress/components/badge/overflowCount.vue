<template>
    <FBadge :count="100">
        <a href="#" class="example" />
    </FBadge>
    <FBadge :count="10" :overflowCount="9">
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
