import {h, defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return () => {
            return <div class="test" v-show={false}></div>;
        };
    },
});
