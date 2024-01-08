<template>
    <FSpace>
        <FForm :labelWidth="120">
            <FFormItem label="设置最大内容高度">
                <FRadioGroup
                    v-model="setMaxContentHeight"
                    :options="[
                        { label: '不设置（默认）', value: false },
                        { label: '设置', value: true },
                    ]"
                />
            </FFormItem>
            <FFormItem v-if="setMaxContentHeight" label="内容高度类型">
                <FRadioGroup
                    v-model="type"
                    :options="[
                        { label: '百分比', value: 1 },
                        { label: '固定值', value: 2 },
                    ]"
                />
            </FFormItem>
            <FFormItem
                v-if="type === 1 && setMaxContentHeight"
                label="屏幕百分比"
            >
                <FInputNumber
                    v-model="percent"
                    :min="10"
                    :max="100"
                    :step="10"
                ></FInputNumber>
                <span style="margin-left: 10px">vh</span>
            </FFormItem>
            <FFormItem v-if="type === 2 && setMaxContentHeight" label="固定值">
                <FInputNumber
                    v-model="maxContentHeight"
                    :min="100"
                    :max="1000"
                    :step="100"
                ></FInputNumber>
                <span style="margin-left: 10px">px</span>
            </FFormItem>
        </FForm>
    </FSpace>
    <FSpace>
        <FButton @click="show = true">打开弹窗</FButton>
        <FButton @click="show1 = true">居中弹窗</FButton>
        <FModal
            v-model:show="show"
            title="弹窗标题"
            :maxContentHeight="
                setMaxContentHeight
                    ? type === 1
                        ? `${percent}vh`
                        : maxContentHeight
                    : undefined
            "
            @ok="show = false"
        >
            <FButton @click="add">内容 + 1</FButton>
            <FButton @click="reduce">内容 - 1</FButton>
            <div v-for="n in count" :key="n">我是内容...</div>
        </FModal>
        <FModal
            v-model:show="show1"
            title="居中弹窗"
            vertical-center
            :maxContentHeight="
                setMaxContentHeight
                    ? type === 1
                        ? `${percent}vh`
                        : maxContentHeight
                    : undefined
            "
            @ok="show = false"
        >
            <FButton @click="add">内容 + 1</FButton>
            <FButton @click="reduce">内容 - 1</FButton>
            <div v-for="n in count" :key="n">我是内容...</div>
        </FModal>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const show = ref(false);
        const show1 = ref(false);
        const setMaxContentHeight = ref(false);
        const percent = ref(20);
        const maxContentHeight = ref(300);
        const type = ref(1);
        const count = ref(5);

        const add = () => {
            count.value += 1;
        };

        const reduce = () => {
            count.value -= 1;
        };

        return {
            show,
            show1,
            setMaxContentHeight,
            percent,
            maxContentHeight,
            type,
            count,
            add,
            reduce,
        };
    },
};
</script>
