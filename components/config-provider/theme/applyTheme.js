import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';

const CSS_VAR_PREFIX = '--f-';
export function applyTheme(container, theme, themeOverrides) {
    // TODO 逻辑优化
    const _theme = theme || baseTheme(themeOverrides);
    const _container = container || document.body;
    let cssVarStyle = '';
    // TODO 增量更新
    Object.keys(_theme).forEach((key) => {
        cssVarStyle += `${CSS_VAR_PREFIX}${kebabCase(key)}: ${_theme[key]};`;
    });
    _container.style = cssVarStyle + _container.style;
}
