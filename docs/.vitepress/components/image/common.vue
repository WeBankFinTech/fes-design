<template>
    <FForm :labelWidth="160">
        <FFormItem label="宽度：">
            <FInputNumber
                v-model="width"
                :min="50"
                :max="300"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="高度：">
            <FInputNumber
                v-model="height"
                :min="50"
                :max="300"
                :step="10"
            ></FInputNumber>
            <span style="margin-left: 10px">px</span>
        </FFormItem>
        <FFormItem label="适应方式：">
            <FRadioGroup v-model="fit">
                <FRadio value="fill">fill</FRadio>
                <FRadio value="contain">contain</FRadio>
                <FRadio value="cover">cover</FRadio>
                <FRadio value="none">none</FRadio>
                <FRadio value="scale-down">scale-down</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="图像描述：">
            <FInput v-model="alt"></FInput>
        </FFormItem>
    </FForm>

    <FDivider></FDivider>

    <FImage
        :src="src"
        :width="width"
        :height="`${height}px`"
        :fit="fit"
        :alt="alt"
    >
        <template #placeholder>
            <div class="image-slot">
                <div class="image-slot">
                    Loading<span class="dot">...</span>
                </div>
            </div>
        </template>
    </FImage>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const src = ref('/images/1.jpeg');
        const width = ref(150);
        const height = ref(150);
        const fit = ref('fill');
        const alt = ref('这是一段图片描述文字');

        return {
            width,
            height,
            fit,
            src,
            alt,
        };
    },
};
</script>
