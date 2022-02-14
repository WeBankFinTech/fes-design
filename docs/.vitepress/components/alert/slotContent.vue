<template>
    <FAlert class="mtb-10" showIcon closable type="info" message="自定义操作">
        <template #action><div>详情</div></template>
    </FAlert>
    <FAlert
        class="mtb-10"
        showIcon
        closable
        type="success"
        message="正确表达提示内容"
    >
        <div>自定义消息</div>
    </FAlert>
    <FAlert
        class="mtb-10"
        showIcon
        closable
        type="warning"
        message="自定义图标"
    >
        <template #icon><UserOutlined /></template>
    </FAlert>
    <FAlert
        class="mtb-10"
        showIcon
        closable
        type="error"
        message="自定义辅助信息"
    >
        <template #description>
            <div>
                自定义辅助信息自定义辅助信息自定义辅助信息自定义辅助信息自定义辅助信息自定义辅助信息自定义辅助信息
            </div>
        </template>
    </FAlert>
</template>

<style scoped>
.mtb-10 {
    margin: 10px 0;
}
</style>
