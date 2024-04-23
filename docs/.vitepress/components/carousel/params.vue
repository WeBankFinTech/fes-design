<template>
    <FSpace vertical class="carousel-demo">
        <FForm labelWidth="100px">
            <FFormItem label="箭头:">
                <FRadioGroup
                    v-model="showArrow"
                    :options="[
                        { label: 'always', value: 'always' },
                        { label: 'hover(默认)', value: 'hover' },
                        { label: 'never', value: 'never' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="指示器类型:">
                <FRadioGroup
                    v-model="indicatorType"
                    :options="[
                        { label: 'linear(默认)', value: 'linear' },
                        { label: 'dot', value: 'dot' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="指示器方向:">
                <FRadioGroup
                    v-model="indicatorPlacement"
                    :options="[
                        { label: 'top', value: 'top' },
                        { label: 'bottom(默认)', value: 'bottom' },
                        { label: 'left', value: 'left' },
                        { label: 'right', value: 'right' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="指示器位置:">
                <FRadioGroup
                    v-model="indicatorPosition"
                    :options="[
                        { label: '默认', value: '' },
                        { label: 'outside', value: 'outside' },
                        { label: 'none', value: 'none' },
                    ]"
                />
            </FFormItem>
            <FFormItem label="自动切换间隔:">
                <FInputNumber
                    v-model="interval"
                    style="width: 200px"
                    placeholder="间隔时间，单位为毫秒"
                />
            </FFormItem>
            <FFormItem label="是否自动播放:">
                <FRadioGroup
                    v-model="autoPlay"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
            <FFormItem label="是否循环播放:">
                <FRadioGroup
                    v-model="isLoop"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
            <FFormItem label="悬浮暂停播放:">
                <FRadioGroup
                    v-model="isHoverPause"
                    :options="[
                        { label: '是(默认)', value: true },
                        { label: '否', value: false },
                    ]"
                />
            </FFormItem>
        </FForm>

        <FDivider />

        <FCarousel
            height="240px"
            :loop="isLoop"
            :show-arrow="showArrow"
            :autoplay="autoPlay"
            :interval="interval"
            :indicator-type="indicatorType"
            :indicator-placement="indicatorPlacement"
            :indicator-position="indicatorPosition"
            :pause-on-hover="isHoverPause"
            @change="onChange"
        >
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/f615608955b707cd.png"
                >
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/5c8bf7eb1ef7a400.png"
                >
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/ebaa3c3133c9e964.png"
                >
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/2f68ed8e26dc519b.png"
                >
            </FCarouselItem>
        </FCarousel>
    </FSpace>
</template>

<script setup>
import { ref } from 'vue';

const showArrow = ref('hover');
const indicatorType = ref('linear');
const indicatorPlacement = ref('bottom');
const indicatorPosition = ref('');
const interval = ref(3000);
const autoPlay = ref(true);
const isLoop = ref(true);
const isHoverPause = ref(true);

const onChange = (current) => {
    console.log('[carousel.default] [onChange] current:', current);
};
</script>

<style scope>
.carousel-demo .fes-carousel .fes-carousel-item img {
    width: 100%;
    height: 100%;
}
</style>
