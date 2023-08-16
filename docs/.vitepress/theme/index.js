import DefaultTheme from 'vitepress/theme';
import FesDesign from '@fesjs/fes-design';
// eslint-disable-next-line import/no-unresolved
import '@fesjs/fes-design/_style';

import * as Icons from './IconDoc/icons';
import IconDoc from './IconDoc/IconDoc';
import './IconDoc/index.less';
import '../../../components/icon/style';

import WIframe from './components/wIframe.vue';
import NotFound from './components/notFound.vue';
import ComponentDoc from './components/componentDoc.vue';

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
        app.use(FesDesign);
        app.component('ComponentDoc', ComponentDoc);

        app.provide('filter-headers', (headers) => {
            return headers;
        });
    },
};
