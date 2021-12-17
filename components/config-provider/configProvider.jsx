import { defineComponent, watch, reactive } from 'vue';
import { isObject, isNil } from 'lodash-es';
import { applyTheme } from './theme/applyTheme';

const config = reactive({
    getContainer: () => document.body,
});

// TODO 逻辑优化，如果用户不使用 FConfigProvider 如何设置默认 theme?
applyTheme();
export const setConfig = (data) => {
    if (isObject(data)) {
        Object.keys(data).forEach((prop) => {
            if (!isNil(data[prop])) {
                config[prop] = data[prop];
            }
        });
    }
    applyTheme(config.getContainer(), config.theme, config.themeOverrides);
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
