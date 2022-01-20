import escapeHtml from 'escape-html';
import prism from 'prismjs';

import 'prismjs/themes/prism.css';

function wrap(code, lang) {
    if (lang === 'text') {
        code = escapeHtml(code);
    }
    return `<pre v-pre><code>${code}</code></pre>`;
}

export const highlight = (str, lang) => {
    if (!lang) {
        return wrap(str, 'text');
    }
    lang = lang.toLowerCase();
    const rawLang = lang;
    if (lang === 'vue' || lang === 'html') {
        lang = 'markup';
    }
    if (prism.languages[lang]) {
        const code = prism.highlight(str, prism.languages[lang], lang);
        return wrap(code, rawLang);
    }
    return wrap(str, 'text');
};
