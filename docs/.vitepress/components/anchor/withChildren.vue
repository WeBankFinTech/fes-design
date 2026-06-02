<template>
    <FAnchor
        :links="[
            { title: '基础用法', href: '#basic' },
            { title: '带子链接', href: '#with-children', children: [
                { title: '子链接 A', href: '#child-a' },
                { title: '子链接 B', href: '#child-b' }
            ]},
            { title: '自定义容器', href: '#container' }
        ]"
    />
    <div id="basic" style="height: 200px; margin-top: 20px; padding: 20px; background: #f5f5f5;">
        <h3>基础用法</h3>
    </div>
    <div id="with-children" style="height: 200px; padding: 20px; background: #f0f0f0;">
        <h3>带子链接</h3>
    </div>
    <div id="child-a" style="height: 200px; padding: 20px; background: #e5e5e5;">
        <h4>子链接 A</h4>
    </div>
    <div id="child-b" style="height: 200px; padding: 20px; background: #d5d5d5;">
        <h4>子链接 B</h4>
    </div>
    <div id="container" style="height: 200px; padding: 20px; background: #f5f5f5;">
        <h3>自定义容器</h3>
    </div>
</template>
