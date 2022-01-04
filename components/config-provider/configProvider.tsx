import { defineComponent, watch, reactive, PropType } from 'vue';
import { isObject, isNil } from 'lodash-es';

import type { ConfigProvider } from './interface';
import type { Theme } from '../_theme/interface';
import type { GetContainer } from '../_util/interface'

const config = reactive<ConfigProvider>({
    getContainer: () => document.body,
});

const configProviderProps = {
    getContainer: Function as PropType<GetContainer>,
    theme: String,
    themeOverrides: Object as PropType<Partial<Theme>>,
} as const;

export const setConfig = (data: ConfigProvider) => {
    if (isObject(data)) {
        Object.keys(data).forEach((prop) => {
            if (!isNil(data[prop as keyof typeof data])) {
                (config as any)[prop] = data[prop as keyof typeof data];
            }
        });
    }
};

export const getConfig = () => config;

export default defineComponent({
    name: 'FConfigProvider',
    props: configProviderProps,
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
