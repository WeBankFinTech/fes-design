<template>
    <Space>
        <FButton type="primary" :loading="true">
            <template #icon>
                <ProductOutlined />
            </template>
        </FButton>
        <FButton>
            <template #icon> <ProductOutlined /> </template>Default
        </FButton>
        <FButton type="primary">
            <template #icon> <ProductOutlined /> </template>Primary
        </FButton>
        <FButton type="text">
            <template #icon> <ProductOutlined /> </template>Text
        </FButton>
        <FButton type="link">
            <template #icon> <ProductOutlined /> </template>Link
        </FButton>
    </Space>
</template>
