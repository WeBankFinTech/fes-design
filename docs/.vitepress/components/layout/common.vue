<template>
    <f-layout>
        <f-header></f-header>
        <f-main></f-main>
        <f-footer></f-footer>
    </f-layout>

    <f-layout style="margin-top: 20px">
        <f-header></f-header>
        <f-layout>
            <f-aside></f-aside>
            <f-main></f-main>
        </f-layout>
        <f-footer></f-footer>
    </f-layout>

    <f-layout style="margin-top: 20px">
        <f-aside></f-aside>
        <f-layout>
            <f-header></f-header>
            <f-main></f-main>
            <f-footer></f-footer>
        </f-layout>
    </f-layout>
</template>

<style scoped>
.fes-layout-header,
.fes-layout-footer {
    background: rgba(128, 128, 128, 0.2);
}

.fes-layout-footer {
    padding: 24px;
}

.fes-layout-aside {
    background: rgba(128, 128, 128, 0.3);
}

.fes-layout-main {
    padding: 24px;
    background: rgba(128, 128, 128, 0.4);
}
</style>
