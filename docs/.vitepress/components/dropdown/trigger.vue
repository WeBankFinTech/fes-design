<template>
    <FSpace>
        <FSelect v-model="trigger" style="width: 100px">
            <FOption value="hover">hover</FOption>
            <FOption value="click">click</FOption>
            <FOption value="focus">focus</FOption>
            <FOption value="contextmenu">contextmenu</FOption>
        </FSelect>
        <FDropdown :trigger="trigger" :options="options">
            <FButton>{{ trigger }}</FButton>
        </FDropdown>
    </FSpace>
</template>
<script>
import { h, ref } from 'vue';
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
        const trigger = ref('hover');
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
            trigger,
            options,
        };
    },
};
</script>
