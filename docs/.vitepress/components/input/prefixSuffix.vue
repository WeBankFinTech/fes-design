<template>
    <Space>
        <FInput placeholder="请输入">
            <template #suffix>
                <SearchOutlined @click="search" />
            </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #suffix>
                <UserOutlined />
            </template>
        </FInput>

        <FInput placeholder="请输入">
            <template #prefix> ¥ </template>
            <template #suffix> RMB </template>
        </FInput>
    </Space>
</template>

<script>
export default {
    setup() {
        const search = () => {
            console.log('search');
        };

        return {
            search,
        };
    },
};
</script>
