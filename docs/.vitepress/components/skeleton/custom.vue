<template>
    <FSkeleton class="wrapper" :width="100" :height="100">
        <PictureOutlined class="icon" />
    </FSkeleton>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.icon {
    color: #cdced0;
    font-size: 40px;
}
</style>
