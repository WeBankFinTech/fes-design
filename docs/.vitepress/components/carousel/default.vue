<template>
    <Space class="carousel-demo">
        <FCarousel height="240px" @change="onChange">
            <FCarouselItem>
                <img src="https://s4.ax1x.com/2021/12/22/T1AQmj.png" />
            </FCarouselItem>
            <FCarouselItem>
                <img src="https://s4.ax1x.com/2021/12/22/T1AoNt.png" />
            </FCarouselItem>
            <FCarouselItem>
                <img src="https://s3.bmp.ovh/imgs/2021/12/db8a9d08fcba2a27.png" />
            </FCarouselItem>
            <FCarouselItem>
                <img src="https://s4.ax1x.com/2021/12/22/T1Ecan.png" />
            </FCarouselItem>
        </FCarousel>
    </Space>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const onChange = (current) => {
            console.log(current);
        };

        return {
            onChange
        };
    },
});
</script>

<style scope>
.carousel-demo .fes-carousel .fes-carousel-item img {
    width: 100%;
    height: 100%;
}
</style>
