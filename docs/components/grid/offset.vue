<template>
    <f-grid :gutter="20">
        <f-grid-item :span="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
        <f-grid-item :span="6" :offset="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
    </f-grid>
    <f-grid :gutter="20">
        <f-grid-item :span="6" :offset="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
        <f-grid-item :span="6" :offset="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
    </f-grid>
</template>