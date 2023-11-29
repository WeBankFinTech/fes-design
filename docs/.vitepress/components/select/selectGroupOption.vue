<template>
    <FForm :labelWidth="100">
        <FFormItem label="基础用法:">
            <FSelect v-model="value1" style="width: 200px" filterable>
                <FSelectGroupOption
                    v-for="group in options"
                    :key="group.label"
                    :label="group.label"
                    :disabled="group.disabled"
                >
                    <FOption
                        v-for="item in group.options"
                        :key="item.label"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </FOption>
                </FSelectGroupOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="配置方式:">
            <FSelect
                v-model="value2"
                style="width: 200px"
                :options="options"
                tag
                filterable
                multiple
            ></FSelect>
        </FFormItem>
        <FFormItem label="自定义标签:">
            <FSelect v-model="value3" style="width: 200px">
                <FSelectGroupOption>
                    <template #label>
                        <span class="label-color">Admin</span>
                    </template>
                    <FOption value="bob">bob</FOption>
                    <FOption value="tina">tina</FOption>
                    <FOption value="peter">peter</FOption>
                </FSelectGroupOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="多级嵌套:">
            <FSelect
                v-model="value2"
                style="width: 200px"
                :options="cityOptions"
                tag
                filterable
                multiple
            ></FSelect>
        </FFormItem>
    </FForm>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const value1 = ref('');
        const value2 = ref([]);
        const value3 = ref('');

        const options = [
            {
                label: '华中地区',
                options: [
                    {
                        value: '湖北',
                        label: '湖北',
                    },
                    {
                        value: '湖南',
                        label: '湖南',
                    },
                    {
                        value: '河南',
                        label: '河南',
                    },
                    {
                        value: '江西',
                        label: '江西',
                    },
                ],
            },
            {
                label: '华南地区',
                disabled: true,
                options: [
                    {
                        value: '广东',
                        label: '广东',
                    },
                    {
                        value: '广西',
                        label: '广西',
                    },
                    {
                        value: '海南',
                        label: '海南',
                    },
                ],
            },
            {
                label: '华北地区',
                options: [
                    {
                        value: '北京',
                        label: '北京',
                    },
                    {
                        value: '天津',
                        label: '天津',
                    },
                    {
                        value: '河北',
                        label: '河北',
                    },
                    {
                        value: '山西',
                        label: '山西',
                    },
                    {
                        value: '内蒙古',
                        label: '内蒙古',
                    },
                ],
            },
            {
                label: '华东地区',
                options: [
                    {
                        value: '山东',
                        label: '山东',
                    },
                    {
                        value: '江苏',
                        label: '江苏',
                    },
                    {
                        value: '安徽',
                        label: '安徽',
                    },
                    {
                        value: '浙江',
                        label: '浙江',
                    },
                    {
                        value: '福建',
                        label: '福建',
                    },
                    {
                        value: '上海',
                        label: '上海',
                    },
                ],
            },
        ];

        const cityOptions = [
            {
                label: '华中地区',
                options: [
                    {
                        value: '1.1',
                        label: '湖南',
                    },
                    {
                        value: '1.2',
                        label: '湖北',
                        options: [
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
                options: [
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
        ];

        return {
            options,
            cityOptions,
            value1,
            value2,
            value3,
        };
    },
};
</script>

<style lang="less" scoped>
.label-color {
    color: red;
}
</style>
