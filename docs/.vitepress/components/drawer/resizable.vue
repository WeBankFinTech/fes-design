<template>
    <FForm>
        <FFormItem label="位置:">
            <FRadioGroup v-model="placement">
                <FRadio value="top">top</FRadio>
                <FRadio value="bottom">bottom</FRadio>
                <FRadio value="left">left</FRadio>
                <FRadio value="right">right</FRadio>
            </FRadioGroup>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FButton @click="open">打开抽屉</FButton>
    <FDrawer
        v-model:show="show"
        title="这里是标题"
        resizable
        :placement="placement"
        width="600px"
        @ok="show = false"
    >
        <div>我是内容...</div>
        <div>我是内容...</div>
        <div>我是内容...</div>
    </FDrawer>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const show = ref(false);
        const placement = ref('right');

        const open = () => {
            show.value = true;
        };
        return {
            show,
            open,
            placement,
        };
    },
};
</script>
