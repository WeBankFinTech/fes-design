<template>
    <FDropdown :options="options">
        <FButton>下拉菜单</FButton>
    </FDropdown>
</template>

<script>
import { h } from 'vue';
import {
    DeleteOutlined,
    EditOutlined,
    PlusSquareOutlined,
    StarOutlined,
    UserOutlined,
} from '@fesjs/fes-design/icon';

export default {
    setup() {
        const options = [
            {
                value: '1',
                label: '删除',
                icon: () => {
                    return h(DeleteOutlined);
                },
            },
            {
                value: '2',
                label: '修改',
                icon: () => {
                    return h(EditOutlined);
                },
            },
            {
                value: '3',
                label: '添加',
                icon: () => {
                    return h(PlusSquareOutlined);
                },
            },
            {
                value: '4',
                label: '评论',
                icon: () => {
                    return h(UserOutlined);
                },
            },
            {
                value: '5',
                label: '收藏',
                icon: () => {
                    return h(StarOutlined);
                },
            },
        ];
        return {
            options,
        };
    },
};
</script>
