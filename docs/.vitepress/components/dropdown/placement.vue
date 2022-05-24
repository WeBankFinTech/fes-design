<template>
    <FSpace>
        <FDropdown placement="top" :options="options">
            <FButton>top</FButton>
        </FDropdown>
        <FDropdown placement="bottom" :options="options">
            <FButton>bottom</FButton>
        </FDropdown>
        <FDropdown placement="left" :options="options">
            <FButton>left</FButton>
        </FDropdown>
        <FDropdown placement="right" :options="options">
            <FButton>right</FButton>
        </FDropdown>
    </FSpace>
</template>
<script>
import { h } from 'vue';
import {
    DeleteOutlined,
    StarOutlined,
    EditOutlined,
    PlusSquareOutlined,
    UserOutlined,
    // eslint-disable-next-line import/no-unresolved
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
