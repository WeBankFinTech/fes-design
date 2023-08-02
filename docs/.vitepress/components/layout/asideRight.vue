<template>
    <f-layout style="height: 400px">
        <f-aside v-model:collapsed="collapsed" inverted fixed collapsible>
        </f-aside>
        <f-layout fixed :style="{ left: collapsed ? '48px' : '200px' }">
            <f-header bordered fixed> Header </f-header>
            <f-layout embedded fixed style="top: 54px">
                <f-main>
                    <div class="main-page">Main</div>
                </f-main>
                <f-footer> We Design ©2018 Created by MumbleFE </f-footer>
            </f-layout>
        </f-layout>
    </f-layout>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const collapsed = ref(false);
        return {
            collapsed,
        };
    },
};
</script>
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
