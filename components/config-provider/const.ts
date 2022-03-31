import type {
    ExtractPropTypes,
    InjectionKey,
    PropType,
    Ref,
    ToRefs,
} from 'vue';
import type { TypeLanguage } from '../locales';
import type { Theme } from '../_theme/interface';
import type { GetContainer } from '../_util/interface';

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
    getContainer: Function as PropType<GetContainer>,
    theme: String,
    themeOverrides: Object as PropType<Partial<Theme>>,
} as const;

export type ConfigProviderContextType = ExtractPropTypes<
    typeof configProviderProps
>;

export const CONFIG_PROVIDER_INJECTION_KEY: InjectionKey<
    ToRefs<ConfigProviderContextType>
> = Symbol('ConfigProvider');
