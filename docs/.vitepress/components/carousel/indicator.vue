<template>
    <Space class="carousel-demo">
        <FCarousel height="240px" indicator-type="dot">
            <FCarouselItem>
                <img src="https://s3.bmp.ovh/imgs/2021/12/04a87cadff3febad.png" />
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
    <Space class="carousel-demo demo-gap">
        <FCarousel height="240px" indicator-position="outside">
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

<style scope>
.carousel-demo.demo-gap {
    margin-top: 50px;
}

.carousel-demo .fes-carousel .fes-carousel-item img {
    width: 100%;
    height: 100%;
}
</style>