import { InjectionKey } from 'vue';
import { TypeConfigProviderContext, TypeLocaleContext } from './interface';

export const CONFIG_PROVIDER_INJECTION_KEY: InjectionKey<TypeConfigProviderContext> =
    Symbol('ConfigProvider');

export const LOCALE_INJECTION_KEY: InjectionKey<TypeLocaleContext> = Symbol(
    'ConfigProviderLocale',
);
