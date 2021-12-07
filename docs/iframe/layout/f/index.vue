<template>
    <f-layout style="min-height: 100vh">
        <FAside
            v-model:collapsed="collapsed"
            collapsible
            fixed
            inverted
            :showTrigger="false"
        >
            aside
        </FAside>
        <f-layout>
            <FHeader> 收起： <FSwitch v-model="collapsed"></FSwitch> </FHeader>
            <FMain class="demo-main-wrapper">
                <div class="demo-main-page">Main</div>
            </FMain>
            <FFooter class="demo-tal">
                We Design ©2018 Created by MumbleFE
            </FFooter>
        </f-layout>
    </f-layout>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const collapsed = ref(true);
        return {
            collapsed,
        };
    },
};
</script>

<style lang="less">
.demo-main-wrapper {
    padding: 50px 50px 0;
}
.demo-main-page {
    background: #ffffff;
    min-height: 200px;
    padding: 24px;
}
.demo-tal {
    text-align: center;
}
</style>
