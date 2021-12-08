<template>
    <f-layout style="min-height: 100vh">
        <FAside fixed inverted>
            <f-menu mode="vertical" inverted>
                <f-sub-menu value="1">
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                    <template #label>我是标题</template>
                    <f-menu-group>
                        <template #label>华中地区</template>
                        <f-menu-item value="1.1">
                            <template #label>湖北</template>
                        </f-menu-item>
                        <f-sub-menu label="湖南">
                            <f-menu-item value="1.2.1" label="武汉市">
                            </f-menu-item>
                            <f-menu-item value="1.2.2" label="荆州市">
                            </f-menu-item>
                            <f-menu-item value="1.2.3" label="仙桃市">
                            </f-menu-item>
                            <f-menu-item value="1.2.4" label="黄冈市">
                            </f-menu-item>
                            <f-menu-item value="1.2.5" label="孝感市">
                            </f-menu-item>
                        </f-sub-menu>
                    </f-menu-group>
                    <f-menu-group>
                        <template #label> 华南地区 </template>
                        <f-menu-item value="1.3" label="广东"></f-menu-item>
                        <f-menu-item
                            value="1.4"
                            label="广西壮族自治区"
                        ></f-menu-item>
                    </f-menu-group>
                    <f-menu-group>
                        <template #label> 华东地区 </template>
                        <f-menu-item value="1.5" label="浙江"></f-menu-item>
                    </f-menu-group>
                </f-sub-menu>
                <f-menu-item value="2">
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                    <template #label>人群管理</template>
                </f-menu-item>
                <f-menu-item value="3">
                    <template #icon>
                        <AppstoreOutlined />
                    </template>
                    <template #label>资源管理</template>
                </f-menu-item>
            </f-menu>
        </FAside>
        <f-layout>
            <FHeader> Header </FHeader>
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
