<template>
    <f-grid :gutter="20">
        <f-grid-item v-for="item in 4" :key="item" :span="6">
            <div class="col-demo">col-6</div>
        </f-grid-item>
    </f-grid>
</template>
