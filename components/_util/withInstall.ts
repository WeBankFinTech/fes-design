import { Component, App } from 'vue';
import type { FObjectDirective, ComponentInstall } from './interface';

import { noop } from './utils';

export const withInstall = (
    main: Component,
    extra?: Record<string, Component>,
    directives?: FObjectDirective[],
) => {
    const _main = main as ComponentInstall;
    _main.install = (app: App) => {
        for (const comp of [main, ...Object.values(extra ?? {})]) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            app.component(comp.name!, comp);
        }
        if (directives) {
            for (const directive of directives) {
                app.directive(directive.name, directive);
            }
        }
    };
    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            main[key] = comp;
        }
    }
    return _main;
};

export const withNoopInstall = (component: Component) => {
    const _main = component as ComponentInstall;
    _main.install = noop;

    return component;
};
