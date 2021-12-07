<template>
    <f-grid v-for="(a, index) in align" :key="index" :align="a">
        <f-grid-item :span="6" v-for="item in 4" :key="item">
            <div class="col-demo" :style="{padding: 0,  height: item * 40 + 'px', 'line-height': item * 40 + 'px' }">{{a}}</div>
        </f-grid-item>
    </f-grid>
</template>
<script>
import { ref, reactive } from 'vue';

export default {
    setup(){
        const justify = ['flex-start', 'flex-end', 'center', 'space-around', 'space-between'];
        const align = ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'];
        return {
            justify,
            align
        }
    }
}
</script>