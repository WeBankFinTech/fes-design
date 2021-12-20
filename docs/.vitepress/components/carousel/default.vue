<template>
    <Space class="carousel-demo">
        <FCarousel height="200px" @change="onChange">
            <FCarouselItem><div>1</div></FCarouselItem>
            <FCarouselItem><div>2</div></FCarouselItem>
            <FCarouselItem><div>3</div></FCarouselItem>
            <FCarouselItem><div>4</div></FCarouselItem>
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

    .fes-carousel .fes-carousel-item div {
        color: #fff;

        backface-visibility: hidden;
        transform: translateZ(0) scale(1, 1);
    }
}
</style>
