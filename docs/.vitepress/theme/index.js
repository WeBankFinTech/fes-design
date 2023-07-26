import DefaultTheme from 'vitepress/theme';
import WeDesign from '@fesjs/fes-design';
import '@fesjs/fes-design/_style';

import * as Icons from './IconDoc/icons';
import IconDoc from './IconDoc/IconDoc';
import './IconDoc/index.less';
import '../../../components/icon/style';

import WIframe from './components/wIframe';
import NotFound from './components/notFound';
import ComponentDoc from './components/componentDoc';
import Space from './components/space.vue';

import './global.less';

export default {
    extends: DefaultTheme,
    NotFound,
    enhanceApp({ app }) {
        app.component('IconDoc', IconDoc);
        app.component('WIframe', WIframe);
        Object.keys(Icons).forEach((iconName) => {
            app.component(iconName, Icons[iconName]);
        });
        app.use(WeDesign);
        app.component('ComponentDoc', ComponentDoc);
        app.component('Space', Space);

        app.provide('filter-headers', (headers) => {
            return headers;
        });
    },
};
