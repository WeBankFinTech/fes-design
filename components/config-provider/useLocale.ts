import { computed, inject, unref } from 'vue';
import { get } from 'lodash-es';
import { zhCN } from '../locales';
import { CONFIG_PROVIDER_INJECTION_KEY } from './const';
import type { TranslatorType, TranslatorOptionType } from './const';
import type { TypeLanguage } from '../locales';
import type { MaybeRef } from '@vueuse/core';

const translate = (
    path: string,
    option: undefined | TranslatorOptionType,
    locale: TypeLanguage,
): string => {
    return (get(locale, path, '') as string).replace(
        /\{(\w+)\}/g,
        (_, key) => `${option?.[key] ?? `{${key}}`}`,
    );
};

const buildTranslator = (locale: MaybeRef<TypeLanguage>): TranslatorType => {
    return (path: string, option: undefined | TranslatorOptionType) => {
        return translate(path, option, unref(locale));
    };
};

export const useLocale = () => {
    const providerConfig = inject(CONFIG_PROVIDER_INJECTION_KEY, {});
    const localeRef = computed(() => {
        return providerConfig.locale?.value || zhCN;
    });
    return {
        lang: computed(() => {
            return localeRef.value.name;
        }),
        locale: localeRef,
        t: buildTranslator(localeRef),
    };
};
