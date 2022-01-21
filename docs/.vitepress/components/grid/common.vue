<template>
    <f-grid>
        <f-grid-item v-for="item in 2" :key="item" :span="12">
            <div class="col-demo">col-12</div>
        </f-grid-item>
    </f-grid>
    <f-grid>
        <f-grid-item v-for="item in 3" :key="item" :span="8">
            <div class="col-demo">col-8</div>
        </f-grid-item>
    </f-grid>
    <f-grid>
        <f-grid-item v-for="item in 4" :key="item" :span="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
    </f-grid>
</template>
