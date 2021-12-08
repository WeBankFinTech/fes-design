<template>
    <f-grid>
        <f-grid-item :span="6" v-for="item in 4" :order="4-item" :key="item">
            <div class="col-demo">index: {{ item }}  order: {{4-item}}</div>
        </f-grid-item>
    </f-grid>
</template>