import {
    defineComponent, watch,
} from 'vue';
import config from './config';

export default defineComponent({
    name: 'FConfigProvider',
    props: {
        getContainer: Function,
    },
    setup(props, { slots }) {
        watch(props, () => {
            config.setConfig(props);
        }, {
            immediate: true,
        });
        return () => slots.default?.();
    },
});
