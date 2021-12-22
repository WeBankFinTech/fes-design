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

<style lang="less" scope>
.carousel-demo {
    .fes-carousel .fes-carousel-item {
        text-align: center;
        line-height: 200px;
        
        &:nth-child(2n) {
            background: #364d79;
        }
        &:nth-child(2n+1) {
            background: #516fa8;
        }
    }

    .fes-carousel .fes-carousel-item img {
        width: 100%;
        height: 100%;
    }


    .fes-carousel .fes-carousel-item div {
        color: #fff;

        backface-visibility: hidden;
        transform: translateZ(0) scale(1, 1);
    }
}
</style>
