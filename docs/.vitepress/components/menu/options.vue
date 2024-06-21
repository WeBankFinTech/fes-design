<template>
    <f-menu v-model="value" :options="options" />
</template>

<script>
import { h, ref } from 'vue';
import { AppstoreOutlined } from '@fesjs/fes-design/icon';

export default {
    setup() {
        const value = ref(2);
        const options = ref([]);

        setTimeout(() => {
            options.value = [
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
                                    children: [
                                        {
                                            label: '长沙市',
                                            value: '1.1.1',
                                            children: [
                                                {
                                                    label: '天心区',
                                                    value: '1.1.1.1',
                                                },
                                                {
                                                    label: '岳麓区',
                                                    value: '1.1.1.2',
                                                },
                                            ],
                                        },
                                        {
                                            label: '株洲市',
                                            value: '1.1.2',
                                            children: [
                                                {
                                                    label: '荷塘区',
                                                    value: '1.1.2.1',
                                                },
                                                {
                                                    label: '芦淞区',
                                                    value: '1.1.2.2',
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    value: '1.2',
                                    label: '湖北',
                                    children: [
                                        {
                                            label: '武汉',
                                            value: '1.2.1',
                                            children: [
                                                {
                                                    label: '汉阳区',
                                                    value: '1.2.1.1',
                                                },
                                                {
                                                    label: '江汉区',
                                                    value: '1.2.1.2',
                                                },
                                            ],
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
            ];
        }, 1000);

        return {
            value,
            options,
        };
    },
};
</script>
