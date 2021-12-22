<template>
    <Space class="carousel-demo">
        <FCarousel height="240px" trigger="hover">
            <FCarouselItem>
                <img src="https://s4.ax1x.com/2021/12/22/T1ZzEd.png" />
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

    .fes-carousel .fes-carousel-item div {
        color: #fff;

        backface-visibility: hidden;
        transform: translateZ(0) scale(1, 1);
    }
}
</style>