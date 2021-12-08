/* eslint-disable no-restricted-syntax */
import { noop } from './utils';

export const withInstall = (
    main,
    extra,
    directives,
) => {
    main.install = (app) => {
        for (const comp of [main, ...Object.values(extra ?? {})]) {
            app.component(comp.name, comp);
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
    return main;
};

export const withNoopInstall = (component) => {
    component.install = noop;

    return component;
};
