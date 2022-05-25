<template>
    <FSpace vertical class="carousel-demo">
        <FCarousel height="240px" indicator-type="dot">
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/4dc6f0d9e8e99c9d.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/55f807e9509d8b74.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/92cc394c33b8c0b4.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/2f68ed8e26dc519b.png"
                />
            </FCarouselItem>
        </FCarousel>
    </FSpace>
    <FSpace vertical class="carousel-demo demo-gap">
        <FCarousel height="240px" indicator-position="outside">
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/0ebca23ad388fe61.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/5c8bf7eb1ef7a400.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/ebaa3c3133c9e964.png"
                />
            </FCarouselItem>
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/2f68ed8e26dc519b.png"
                />
            </FCarouselItem>
        </FCarousel>
    </FSpace>
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
