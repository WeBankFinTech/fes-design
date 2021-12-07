<template>
    <Space>
        <FInput placeholder="请输入">
            <template #prepend> https:// </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #append>
                <FButton type="primary">搜索</FButton>
            </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #append>
                <FSelect v-model="a" style="width: 90px">
                    <FOption :value="1">湖南</FOption>
                    <FOption :value="2" label="湖北" disabled></FOption>
                    <FOption
                        :value="3"
                        label="浙江浙江浙江浙江浙江浙江浙江浙江浙江"
                    ></FOption>
                    <FOption :value="4" label="广东"></FOption>
                    <FOption :value="5" label="江苏"></FOption>
                </FSelect>
            </template>
        </FInput>
    </Space>
</template>

<script>
import { ref } from 'vue';
export default {
    setup() {
        return {
            a: ref()
        };
    }
};
</script>
