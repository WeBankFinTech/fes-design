<template>
    <FSpace vertical class="carousel-demo">
        <FCarousel height="240px" @change="onChange">
            <FCarouselItem>
                <img
                    src="https://s3.bmp.ovh/imgs/2022/01/f615608955b707cd.png"
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

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const onChange = (current) => {
            console.log('[carousel.default] [onChange] current:', current);
        };

        return {
            onChange,
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
