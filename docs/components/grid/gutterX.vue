<template>
    <f-grid :gutter="20">
        <f-grid-item :span="6" v-for="item in 4" :key="item">
            <div class="col-demo">col-6</div>
        </f-grid-item>
    </f-grid>
</template>