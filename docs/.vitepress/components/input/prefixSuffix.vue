<template>
    <FSpace vertical>
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
            <template #prefix> count ( </template>
            <template #suffix> ) </template>
        </FInput>
    </FSpace>
</template>

<script>
export default {
    setup() {
        const search = () => {
            console.log('[input.prefixSuffix] [search]');
        };

        return {
            search,
        };
    },
};
</script>
