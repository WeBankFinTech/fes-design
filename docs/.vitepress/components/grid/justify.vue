<template>
    <f-grid v-for="(j, index) in justify" :key="index" :justify="j">
        <f-grid-item :span="6" v-for="item in 3" :key="item">
            <div class="col-demo">{{j}}</div>
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