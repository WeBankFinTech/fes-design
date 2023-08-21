<template>
    <FGrid>
        <FGridItem :xs="0" :sm="4" :md="6" :lg="8" :xl="10">
            <div class="col-demo">col</div>
        </FGridItem>
        <FGridItem :xs="20" :sm="16" :md="12" :lg="8" :xl="4">
            <div class="col-demo">col</div>
        </FGridItem>
        <FGridItem :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <div class="col-demo">col</div>
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
