import { computed, inject, unref } from 'vue';
import { CONFIG_PROVIDER_INJECTION_KEY } from './const';
import type { TranslatorType, TranslatorOptionType } from './const';
import { zhCN } from '../locales';
import type { TypeLanguage } from '../locales';
import type { MaybeRef } from '@vueuse/core';
import { get } from 'lodash-es';

const translate = (
    path: string,
    option: undefined | TranslatorOptionType,
    locale: TypeLanguage,
): string =>
    (get(locale, path, path) as string).replace(
        /\{(\w+)\}/g,
        (_, key) => `${option?.[key] ?? `{${key}}`}`,
    );

const buildTranslator =
    (locale: MaybeRef<TypeLanguage>): TranslatorType =>
    (path, option) =>
        translate(path, option, unref(locale));

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
