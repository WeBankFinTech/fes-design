<template>
    <f-menu>
        <f-sub-menu value="1">
            <template #icon>
                <AppstoreOutlined />
            </template>
            <template #label>我是标题</template>
            <f-menu-group>
                <template #label>华中地区</template>
                <f-menu-item value="1.1" disabled>
                    <template #label>湖南</template>
                </f-menu-item>
                <f-sub-menu label="湖北">
                    <f-menu-item value="1.2.1" label="武汉市" />
                    <f-menu-item value="1.2.2" label="荆州市" />
                    <f-menu-item value="1.2.3" label="仙桃市" />
                    <f-menu-item value="1.2.4" label="黄冈市" />
                    <f-menu-item value="1.2.5" label="孝感市" />
                </f-sub-menu>
            </f-menu-group>
            <f-menu-group>
                <template #label> 华南地区 </template>
                <f-menu-item value="1.3" label="广东" />
                <f-menu-item value="1.4" label="广西壮族自治区" />
            </f-menu-group>
            <f-menu-group>
                <template #label> 华东地区 </template>
                <f-menu-item value="1.5" label="浙江" />
            </f-menu-group>
        </f-sub-menu>
        <f-sub-menu value="2">
            <template #icon>
                <AppstoreOutlined />
            </template>
            <template #label>人群管理</template>
            <f-menu-item value="2.1" :disabled="true">
                <template #label>富高帅</template>
            </f-menu-item>
            <f-menu-item value="2.2">
                <template #label>白富美</template>
            </f-menu-item>
            <f-sub-menu label="湖北">
                <f-sub-menu value="2.3.1" label="武汉市">
                    <f-menu-item value="2.3.1.1">
                        <template #label>天心区</template>
                    </f-menu-item>
                    <f-menu-item value="2.3.1.2">
                        <template #label>岳麓区</template>
                    </f-menu-item>
                </f-sub-menu>
                <f-menu-item value="2.3.2" label="荆州市" />
            </f-sub-menu>
            <f-sub-menu label="湖南">
                <f-sub-menu value="2.4.1" label="长沙市">
                    <f-menu-item value="2.4.1.1">
                        <template #label>江汉区</template>
                    </f-menu-item>
                    <f-menu-item value="2.4.1.2">
                        <template #label>汉阳区</template>
                    </f-menu-item>
                </f-sub-menu>
                <f-sub-menu value="2.4.2" label="株洲市">
                    <f-menu-item value="2.4.2.1">
                        <template #label>荷塘区</template>
                    </f-menu-item>
                    <f-menu-item value="2.4.2.2">
                        <template #label>芦淞区</template>
                    </f-menu-item>
                </f-sub-menu>
            </f-sub-menu>
        </f-sub-menu>
        <f-menu-item value="3">
            <template #label>资源管理</template>
        </f-menu-item>
    </f-menu>
</template>
