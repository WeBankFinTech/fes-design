import type {
    ComponentObjectPropsOptions,
    InjectionKey,
    PropType,
    Ref,
} from 'vue';
import { defaultContainer } from '../_util/utils';
import type { TypeLanguage } from '../locales';
import type { Theme } from '../_theme/interface';
import type { ExtractPublicPropTypes, GetContainer } from '../_util/interface';

export type TranslatorOptionType = Record<string, string | number>;

export type TranslatorType = (
    path: string,
    option?: TranslatorOptionType,
) => string;

export type LocaleContextType = {
    locale: Ref<TypeLanguage>;
    lang: Ref<string>;
    t: TranslatorType;
};

export const configProviderProps = {
    locale: Object as PropType<TypeLanguage>,
    getContainer: {
        type: Function as PropType<GetContainer>,
        default: defaultContainer,
    },
    theme: String,
    themeOverrides: Object as PropType<Theme>,
} as const satisfies ComponentObjectPropsOptions;

export type ConfigProviderProps = ExtractPublicPropTypes<
    typeof configProviderProps
>;

export type ConfigProviderContextType = {
    locale?: Ref<TypeLanguage>;
    getContainer?: Ref<GetContainer>;
    theme?: Ref<string>;
    themeOverrides?: Ref<Theme>;
};

export const CONFIG_PROVIDER_INJECTION_KEY: InjectionKey<ConfigProviderContextType>
    = Symbol('ConfigProvider');
