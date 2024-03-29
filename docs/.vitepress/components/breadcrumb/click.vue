<template>
    <FBreadcrumb>
        <FBreadcrumbItem @click="handleClick">首页</FBreadcrumbItem>
        <FBreadcrumbItem>二级页面 </FBreadcrumbItem>
        <FBreadcrumbItem>三级页面</FBreadcrumbItem>
    </FBreadcrumb>
</template>

<script setup>
const handleClick = () => {
    console.log('自定义点击事件');
};
</script>
