<template>
    <FGrid :gutter="20">
        <FGridItem v-for="item in 4" :key="item" :span="6">
            <div class="col-demo">col-6</div>
        </FGridItem>
    </FGrid>
</template>

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
