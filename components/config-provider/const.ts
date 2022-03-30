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

export type TypeTranslatorOption = Record<string, string | number>;

export type TypeTranslator = (
    path: string,
    option?: TypeTranslatorOption,
) => string;

export type TypeLocaleContext = {
    locale: Ref<TypeLanguage>;
    lang: Ref<string>;
    t: TypeTranslator;
};

export const configProviderProps = {
    locale: Object as PropType<TypeLanguage>,
    getContainer: Function as PropType<GetContainer>,
    theme: String,
    themeOverrides: Object as PropType<Partial<Theme>>,
} as const;

export type TypeConfigProviderContext = ExtractPropTypes<
    typeof configProviderProps
>;

export const CONFIG_PROVIDER_INJECTION_KEY: InjectionKey<
    ToRefs<TypeConfigProviderContext>
> = Symbol('ConfigProvider');
