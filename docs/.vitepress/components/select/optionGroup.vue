<template>
    <FSpace>
        <FSelect v-model="value1" style="width: 200px">
            <FOptionGroup>
                <template #label>
                    <span class="label-color">Admin</span>
                </template>
                <FOption value="lucy">lucy</FOption>
                <FOption value="tom">tom</FOption>
                <FOption value="jack">jack</FOption>
            </FOptionGroup>
            <FOptionGroup label="Manager">
                <FOption value="bob">bob</FOption>
                <FOption value="tina">tina</FOption>
                <FOption value="peter">peter</FOption>
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
                        label: 'Jack',
                    },
                    {
                        value: 'lucy',
                        label: 'Lucy',
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
