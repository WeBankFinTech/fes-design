<template>
    <FSpace>
        <FButton @click="show[0] = true">点我</FButton>
        <FButton class="ml-10" @click="show[1] = true">没有标题</FButton>
        <FButton class="ml-10" @click="show[2] = true">不显示关闭</FButton>
        <FButton class="ml-10" @click="show[3] = true">没有遮罩</FButton>
        <FButton class="ml-10" @click="show[4] = true">显示页脚</FButton>
        <FDrawer
            v-model:show="show[0]"
            title="这里是标题"
            displayDirective="if"
            @ok="show[0] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>
        <FDrawer v-model:show="show[1]" @ok="show[1] = true">
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>

        <FDrawer
            v-model:show="show[2]"
            title="这里是标题"
            :closable="false"
            @ok="show[2] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>

        <FDrawer
            v-model:show="show[3]"
            title="这里是标题"
            :mask="false"
            @ok="show[3] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>
        <FDrawer
            v-model:show="show[4]"
            title="这里是标题"
            :footer="true"
            @ok="show[4] = false"
        >
            <div style="height: 1000px">我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FDrawer>
    </FSpace>
</template>

<script>
import { reactive } from 'vue';

export default {
    setup() {
        const show = reactive([]);
        return {
            show,
        };
    },
};
</script>
