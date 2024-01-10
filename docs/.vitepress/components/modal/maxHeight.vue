<template>
    <FSpace>
        <FButton @click="show = true">打开弹窗</FButton>
        <FButton @click="verticalCenterBtnClick">居中弹窗</FButton>
        <FModal
            v-model:show="show"
            title="弹窗标题"
            :vertical-center="verticalCenter"
            :maxHeight="
                setMaxHeight
                    ? type === 1
                        ? `${percent}%`
                        : maxHeight
                    : undefined
            "
            @ok="show = false"
        >
            <FSpace>
                <FForm :labelWidth="120">
                    <FFormItem label="设置最大弹窗高度">
                        <FRadioGroup
                            v-model="setMaxHeight"
                            :options="[
                                { label: '不设置（默认）', value: false },
                                { label: '设置', value: true },
                            ]"
                        />
                    </FFormItem>
                    <FFormItem v-if="setMaxHeight" label="内容高度类型">
                        <FRadioGroup
                            v-model="type"
                            :options="[
                                { label: '百分比', value: 1 },
                                { label: '固定值', value: 2 },
                            ]"
                        />
                    </FFormItem>
                    <FFormItem
                        v-if="type === 1 && setMaxHeight"
                        label="屏幕百分比"
                    >
                        <FInputNumber
                            v-model="percent"
                            :min="10"
                            :max="100"
                            :step="10"
                        ></FInputNumber>
                        <span style="margin-left: 10px">%</span>
                    </FFormItem>
                    <FFormItem v-if="type === 2 && setMaxHeight" label="固定值">
                        <FInputNumber
                            v-model="maxHeight"
                            :min="100"
                            :max="1000"
                            :step="100"
                        ></FInputNumber>
                        <span style="margin-left: 10px">px</span>
                    </FFormItem>
                </FForm>
            </FSpace>
            <FDivider></FDivider>
            <FSpace>
                <FButton @click="add">内容 + 1</FButton>
                <FButton @click="reduce">内容 - 1</FButton>
            </FSpace>
            <FDivider></FDivider>
            <div v-for="n in count" :key="n">我是内容...</div>
        </FModal>
    </FSpace>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const show = ref(false);
        const setMaxHeight = ref(false);
        const percent = ref(50);
        const maxHeight = ref(300);
        const type = ref(1);
        const count = ref(5);
        const verticalCenter = ref(false);

        const add = () => {
            count.value += 1;
        };

        const reduce = () => {
            count.value -= 1;
        };

        const verticalCenterBtnClick = () => {
            verticalCenter.value = true;
            show.value = true;
        };

        return {
            show,
            setMaxHeight,
            percent,
            maxHeight,
            type,
            count,
            add,
            reduce,
            verticalCenter,
            verticalCenterBtnClick,
        };
    },
};
</script>
