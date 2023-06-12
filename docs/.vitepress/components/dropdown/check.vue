<template>
    <FDropdown arrow :options="options" showSelectedOption>
        <FButton>下拉菜单</FButton>
    </FDropdown>
</template>
<script>
export default {
    setup() {
        const options = [
            {
                value: '1',
                label: '删除',
                disabled: true,
            },
            {
                value: '2',
                label: '修改',
            },
            {
                value: '3',
                label: '添加',
            },
            {
                value: '4',
                label: '评论',
            },
            {
                value: '5',
                label: '收藏',
            },
        ];
        return {
            options,
        };
    },
};
</script>
