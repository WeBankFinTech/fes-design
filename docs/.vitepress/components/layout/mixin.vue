<template>
    <f-layout style="height: 400px">
        <f-header inverted bordered fixed> Header </f-header>
        <f-layout fixed style="top: 54px">
            <f-aside> Aside </f-aside>
            <f-layout embedded>
                <f-main>
                    <div class="main-page">Main</div>
                </f-main>
                <f-footer> We Design ©2018 Created by MumbleFE </f-footer>
            </f-layout>
        </f-layout>
    </f-layout>
</template>

<style scoped>
.fes-layout-main {
    padding: 24px 24px 0;
}
.main-page {
    background: #ffffff;
    min-height: 500px;
    padding: 24px;
}
.fes-layout-footer {
    padding: 16px;
    text-align: center;
}
</style>
