import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';

const CSS_VAR_PREFIX = '--f-';
export function applyTheme(container, theme, themeOverrides) {
    // TODO 逻辑优化
    const _theme = theme || baseTheme(themeOverrides);
    const _container = container || document.body;
    Object.keys(_theme).forEach((key) => {
        _container.style.setProperty(
            `${CSS_VAR_PREFIX}${kebabCase(key)}`,
            _theme[key],
        );
    });
}
