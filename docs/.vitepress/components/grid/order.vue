<template>
    <f-grid>
        <f-grid-item v-for="item in 4" :key="item" :span="6" :order="4 - item">
            <div class="col-demo">index: {{ item }} order: {{ 4 - item }}</div>
        </f-grid-item>
    </f-grid>
</template>
