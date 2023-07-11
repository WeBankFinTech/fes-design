import { Component, App, Plugin } from 'vue';
import { noop } from './utils';
import type { FObjectDirective } from './interface';

export function withInstall<T extends Plugin>(
    main: T,
    extra?: Record<string, Component>,
    directives?: FObjectDirective[],
): T {
    const _main = main as any;
    _main.install = (app: App) => {
        for (const comp of [main, ...Object.values(extra ?? {})]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            app.component((comp as any).name, comp);
        }
        if (directives) {
            for (const directive of directives) {
                app.directive(directive.name, directive);
            }
        }
    };
    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            _main[key] = comp;
        }
    }
    return _main as T;
}

export function withNoopInstall<T extends Plugin>(component: T) {
    const _main = component;
    _main.install = noop;

    return _main;
}
