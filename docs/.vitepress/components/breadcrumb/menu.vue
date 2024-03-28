<template>
    <FBreadcrumb icon>
        <FBreadcrumbItem>首页</FBreadcrumbItem>
        <FBreadcrumbItem>二级页面 </FBreadcrumbItem>
        <FBreadcrumbItem :menu="menu">三级页面</FBreadcrumbItem>
    </FBreadcrumb>
</template>

<script setup>
const menu = [
    {
        name: '按钮组件介绍',
        path: '/zh/components/button.html',
    },
    {
        name: '表格组件介绍',
        path: '/zh/components/table.html',
    },
];
</script>
