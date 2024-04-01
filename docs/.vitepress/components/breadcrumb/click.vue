<template>
    <FBreadcrumb>
        <FBreadcrumbItem @click="handleClick">首页</FBreadcrumbItem>
        <FBreadcrumbItem>
            <router-link :to="{ path: 'apple', query: { color: 'red' } }">
                二级页面
            </router-link>
        </FBreadcrumbItem>
        <FBreadcrumbItem>三级页面</FBreadcrumbItem>
    </FBreadcrumb>
</template>

<script setup>
const handleClick = () => {
    window.location.href = '/';
};
</script>
