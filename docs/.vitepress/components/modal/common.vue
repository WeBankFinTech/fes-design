<template>
    <FSpace>
        <FButton @click="show[0] = true">常规</FButton>
        <FButton class="ml-10" @click="show[1] = true">没有标题</FButton>
        <FButton class="ml-10" @click="show[2] = true">不显示关闭</FButton>
        <FButton class="ml-10" @click="show[3] = true">没有遮罩</FButton>
        <FButton class="ml-10" @click="show[4] = true">内容居中</FButton>
        <FButton class="ml-10" @click="show[6] = true">全屏</FButton>
        <FButton class="ml-10" @click="show[7] = true">垂直居中</FButton>
        <FModal
            v-model:show="show[0]"
            title="常规"
            displayDirective="if"
            @ok="show[0] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>
        <FModal v-model:show="show[1]" @ok="show[1] = true">
            <div>没有标题...</div>
            <div>没有标题...</div>
            <div>没有标题...</div>
        </FModal>

        <FModal
            v-model:show="show[2]"
            title="不显示关闭"
            :closable="false"
            @ok="show[2] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>

        <FModal
            v-model:show="show[3]"
            title="没有遮罩"
            :mask="false"
            @ok="show[3] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>

        <FModal
            v-model:show="show[4]"
            title="内容居中"
            center
            @ok="show[4] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>

        <FModal
            v-model:show="show[6]"
            title="全屏"
            full-screen
            @ok="show[6] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>

        <FModal
            v-model:show="show[7]"
            title="垂直居中"
            vertical-center
            @ok="show[7] = false"
        >
            <div>我是内容...</div>
            <div>我是内容...</div>
            <div>我是内容...</div>
        </FModal>
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
