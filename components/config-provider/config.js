import { reactive } from 'vue';
import { isObject, isNil } from 'lodash-es';

const config = reactive({
    getContainer: () => document.body,
});

export default {
    setConfig: (data) => {
        if (isObject(data)) {
            Object.keys(data).forEach((prop) => {
                if (!isNil(data[prop])) {
                    config[prop] = data[prop];
                }
            });
        }
    },
    getConfig: () => config,
};
