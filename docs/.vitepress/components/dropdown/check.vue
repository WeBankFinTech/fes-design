<template>
    <FDropdown arrow :options="options" showSelectedOption @scroll="handleScroll">
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
            {
                value: '6',
                label: '点赞',
            },
            {
                value: '7',
                label: '分享',
            },
            {
                value: '8',
                label: '投诉',
            },
            {
                value: '9',
                label: '建议',
            },
            {
                value: '10',
                label: '更新',
            },
            {
                value: '11',
                label: '编辑',
            },
            {
                value: '12',
                label: '更多',
            },
        ];

        const handleScroll = (e) => {
            console.log('[dropdown.check] handleScroll, e:', e);
        };

        return {
            options,
            handleScroll,
        };
    },
};
</script>
