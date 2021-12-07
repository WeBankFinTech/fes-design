<template>
    <space>
        <FDropdown trigger="hover" :options="options">
            <FButton>hover</FButton>
        </FDropdown>
        <FDropdown trigger="click" :options="options">
            <FButton>click</FButton>
        </FDropdown>
        <FDropdown trigger="focus" :options="options">
            <FButton>focus</FButton>
        </FDropdown>
        <FDropdown trigger="contextmenu" :options="options">
            <FButton style="width: 200px">contextmenu</FButton>
        </FDropdown>
    </space>
</template>
<script>
import { h } from 'vue';
import { DeleteOutlined, StarOutlined, EditOutlined, PlusSquareOutlined, UserOutlined} from 'fes-design/icon';

export default {
    setup() {
        const options = [{
            value: '1',
            label: '删除',
            icon: ()=>{
                return h(DeleteOutlined)
            }
        },{
            value: '2',
            label: '修改',
            icon: ()=>{
                return h(EditOutlined)
            }
        },{
            value: '3',
            label: '添加',
            icon: ()=>{
                return h(PlusSquareOutlined)
            }
        },{
            value: '4',
            label: '评论',
            icon: ()=>{
                return h(UserOutlined)
            }
        },{
            value: '5',
            label: '收藏',
            icon: ()=>{
                return h(StarOutlined)
            }
        }]
        return {
            options,
        };
    }
};
</script>