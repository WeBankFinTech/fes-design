import { defineComponent, watch, reactive } from 'vue';
import { isObject, isNil } from 'lodash-es';

const config = reactive({
    getContainer: () => document.body,
});

export const setConfig = (data) => {
    if (isObject(data)) {
        Object.keys(data).forEach((prop) => {
            if (!isNil(data[prop])) {
                config[prop] = data[prop];
            }
        });
    }
};

export const getConfig = () => config;

export default defineComponent({
    name: 'FConfigProvider',
    props: {
        getContainer: Function,
    },
    setup(props, { slots }) {
        watch(
            props,
            () => {
                setConfig(props);
            },
            {
                immediate: true,
            },
        );
        return () => slots.default?.();
    },
});
