<template>
    <FScrollbar ref="container" :height="150">
        <FMenu
            v-model="value"
            :options="options"
            :getContainer="getMenuPopperContainer"
        />
        <br>
        <div v-for="(_, index) in Array.from({ length: 10 })" :key="index" style="color: lightgrey">
            PLACEHOLDER_TEXT
        </div>
    </FScrollbar>
</template>

<script setup>
import { h, ref } from 'vue';
import { AppstoreOutlined } from '@fesjs/fes-design/icon';

const value = ref(2);
const options = ref([
    {
        label: () => '我是子菜单',
        icon: () => {
            return h(AppstoreOutlined);
        },
        value: '1',
        children: [
            {
                label: '华中地区',
                isGroup: true,
                children: [
                    {
                        value: '1.1',
                        label: '湖南',
                    },
                    {
                        value: '1.2',
                        label: '湖北',
                        children: [
                            {
                                label: '武汉',
                                value: '1.2.1',
                            },
                            {
                                label: '孝感',
                                value: '1.2.2',
                            },
                        ],
                    },
                ],
            },
            {
                label: '华南地区',
                isGroup: true,
                children: [
                    {
                        value: '1.3',
                        label: '深圳',
                    },
                    {
                        value: '1.4',
                        label: '广州',
                    },
                ],
            },
        ],
    },
    {
        label: '人群管理',
        value: 2,
    },
    {
        label: '资源管理',
        value: '3',
    },
]);

const container = ref();
const getMenuPopperContainer = () => container.value?.$el;
</script>
