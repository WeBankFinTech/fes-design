<template>
    <FGrid>
        <FGridItem :flex="2">
            <div class="col-demo">2 / 5</div>
        </FGridItem>
        <FGridItem :flex="3">
            <div class="col-demo">3 / 5</div>
        </FGridItem>
    </FGrid>
    <FGrid>
        <FGridItem flex="100px">
            <div class="col-demo">100px</div>
        </FGridItem>
        <FGridItem flex="auto">
            <div class="col-demo">auto</div>
        </FGridItem>
    </FGrid>
    <FGrid>
        <FGridItem flex="1 1 200px">
            <div class="col-demo">1 1 200px</div>
        </FGridItem>
        <FGridItem flex="0 1 300px">
            <div class="col-demo">0 1 300px</div>
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
