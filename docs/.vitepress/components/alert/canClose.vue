<template>
    <div>
        <FAlert
            class="mtb-10"
            showIcon
            closable
            type="info"
            message="常规信息提示内容"
        />
        <FAlert
            class="mtb-10"
            showIcon
            closable
            type="success"
            message="正确表达提示内容"
        />
        <FAlert
            class="mtb-10"
            showIcon
            closable
            type="warning"
            message="警示表达提示内容"
        />
        <FAlert
            class="mtb-10"
            showIcon
            closable
            type="error"
            message="错误表达提示内容"
        />
    </div>
</template>

<style scoped>
.mtb-10 {
    margin: 10px 0;
}
</style>
