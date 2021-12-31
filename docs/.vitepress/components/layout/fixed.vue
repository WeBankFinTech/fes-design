<template>
    <f-layout style="height: 400px">
        <f-header bordered fixed> Header </f-header>
        <f-layout fixed style="top: 54px; bottom: 70px;">
            <f-aside bordered fixed>
                Aside
            </f-aside>
            <f-layout fixed style="left: 200px">
                <f-main>
                    Main
                </f-main>
            </f-layout>
        </f-layout>
        <f-footer fixed bordered class="demo-tal">
            We Design ©2018 Created by MumbleFE
        </f-footer>
    </f-layout>
</template>

<style scoped>
.fes-layout-main {
    min-height: 500px;
    padding: 24px;
}
.fes-layout-footer {
    text-align: center;
    padding: 16px;
}
</style>
