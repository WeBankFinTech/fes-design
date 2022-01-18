import { computed, ComputedRef, inject, provide, ref, unref } from 'vue';
import { LOCALE_INJECTION_KEY } from './const';
import type {
    TypeConfigProviderContext,
    TypeLocaleContext,
    TypeTranslator,
    TypeTranslatorOption,
} from './const';
import { zhCN } from '../locales';
import type { TypeLanguage } from '../locales';
import type { MaybeRef } from '@vueuse/core';
import { get } from 'lodash-es';

let cache: TypeLocaleContext;

const translate = (
    path: string,
    option: undefined | TypeTranslatorOption,
    locale: TypeLanguage,
): string =>
    (get(locale, path, path) as string).replace(
        /\{(\w+)\}/g,
        (_, key) => `${option?.[key] ?? `{${key}}`}`,
    );

const buildTranslator =
    (locale: MaybeRef<TypeLanguage>): TypeTranslator =>
    (path, option) =>
        translate(path, option, unref(locale));

export const provideLocale = (
    props: TypeConfigProviderContext,
    config: ComputedRef<TypeConfigProviderContext>,
) => {
    const locale = computed(() => props.locale || config.value.locale || zhCN);
    const lang = computed(() => locale.value.name);

    const t = buildTranslator(locale);
    const provides: TypeLocaleContext = {
        locale,
        lang,
        t,
    };

    // this could be broken if someone tries to do following:

    /**
     *  <config-provider :locale="lang1">
     *      locale for here is lang1.
     *      <config-provider :locale="lang2">
     *          locale for here is lang2.
     *      </config-provider>
     *  </config-provider>
     */
    cache = provides;
    provide(LOCALE_INJECTION_KEY, provides);
};

export const localeProviderMaker = (locale = zhCN) => {
    const lang = ref(locale.name);
    const localeRef = ref(locale);
    return {
        lang,
        locale: localeRef,
        t: buildTranslator(localeRef),
    };
};

// provideLocale 方法中已做全局配置响应处理，所以这里仅考虑取值即可
export const useLocale = () => {
    return inject(LOCALE_INJECTION_KEY, cache || localeProviderMaker(zhCN));
};
