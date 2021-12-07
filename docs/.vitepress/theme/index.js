import { h } from 'vue'
import { VPTheme, VTBadge } from '@vue/theme'

// eslint-disable-next-line import/no-extraneous-dependencies
import WeDesign from '../../../components/index';
import '../../../components/style';

import * as Icons from './IconDoc/icons';
import IconDoc from './IconDoc/IconDoc';
import './IconDoc/index.less';
import '../../../components/icon/style';

import WIframe from './components/wIframe';
import NoLayout from './components/noLayout';
import NotFound from './components/notFound';
import ComponentDoc from './components/componentDoc';
import Space from './components/space';

import './global.less';

export default Object.assign({}, VPTheme, {
    NotFound,
    enhanceApp({app}) {
        console.log(Object.keys(VPTheme))
        app.component('Badge', VTBadge)
        app.component('IconDoc', IconDoc);
        app.component('WIframe', WIframe);
        Object.keys(Icons).forEach((iconName) => {
            app.component(iconName, Icons[iconName]);
        });
        app.use(WeDesign);
        app.component('ComponentDoc', ComponentDoc);
        app.component('Space', Space)

        app.provide('filter-headers', (headers) => {
            return headers;
        })
    }
});