import * as components from './components';
import type { App, Plugin } from 'vue';

export const install = function (app: App) {
    Object.keys(components).forEach((key) => {
        const comp = components[key as keyof typeof components] as Plugin;
        if (/^(F[A-Z])/.test(key) && comp.install) {
            app.use(comp);
        }
    });
    return app;
};
