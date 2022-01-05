import type { ExtractPropTypes, Ref } from 'vue';
import { TypeLanguage } from '../locales';
import { configProviderProps } from './configProvider';

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

export type TypeConfigProviderContext = ExtractPropTypes<
    typeof configProviderProps
>;
