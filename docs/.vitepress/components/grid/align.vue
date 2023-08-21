<template>
    <FGrid v-for="(a, index) in align" :key="index" :align="a">
        <FGridItem v-for="item in 4" :key="item" :span="6">
            <div
                class="col-demo"
                :style="{
                    padding: 0,
                    height: item * 40 + 'px',
                    'line-height': item * 40 + 'px',
                }"
            >
                {{ a }}
            </div>
        </FGridItem>
    </FGrid>
</template>
<script>
import {} from 'vue';

export default {
    setup() {
        const justify = [
            'flex-start',
            'flex-end',
            'center',
            'space-around',
            'space-between',
        ];
        const align = [
            'flex-start',
            'flex-end',
            'center',
            'baseline',
            'stretch',
        ];
        return {
            justify,
            align,
        };
    },
};
</script>

<style scoped>
.fes-grid-item .col-demo {
    margin: 4px 0;
    padding: 16px 0;
    color: #ffffff;
    text-align: center;
}

.fes-grid-item:nth-child(2n + 1) .col-demo {
    background: rgba(0, 146, 255, 0.75);
}

.fes-grid-item:nth-child(2n) .col-demo {
    background: #0092ff;
}
</style>
