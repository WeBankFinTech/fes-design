<template>
    <FSpace>
        <FSelect v-model="value1" style="width: 200px">
            <FOptionGroup>
                <template #label>
                    <span class="label-color">Admin</span>
                </template>
                <FOption value="bob">bob</FOption>
                <FOption value="tina">tina</FOption>
                <FOption value="peter">peter</FOption>
            </FOptionGroup>
            <FOptionGroup
                v-for="group in options"
                :key="group.label"
                :label="group.label"
            >
                <FOption
                    v-for="item in group.options"
                    :key="item.label"
                    :value="item.value"
                >
                    {{ item.label }}
                </FOption>
            </FOptionGroup>
        </FSelect>
    </FSpace>

    <FSpace>
        <FSelect
            v-model="value2"
            style="width: 200px"
            :options="options"
            filterable
        >
        </FSelect>
    </FSpace>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        const value1 = ref('');

        const value2 = ref('');

        const options = [
            {
                label: 'Manager',
                options: [
                    {
                        value: 'jack',
                        label: 'jack',
                    },
                    {
                        value: 'lucy',
                        label: 'lucy',
                    },
                ],
            },
            {
                label: 'Engineer',
                options: [
                    {
                        value: 'blank',
                        label: 'blank',
                    },
                ],
            },
        ];

        return {
            options,
            value1,
            value2,
        };
    },
};
</script>

<style lang="less" scoped>
.label-color {
    color: pink;
}
</style>
