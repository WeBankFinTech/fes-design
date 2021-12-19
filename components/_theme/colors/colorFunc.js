import Color from './color';

function clamp(val) {
    return Math.min(1, Math.max(0, val));
}

function hsla(h, s, l, a) {
    try {
        if (h instanceof Color) {
            if (s) {
                a = s;
            } else {
                a = h.alpha;
            }
            return new Color(h.rgb, a, 'hsla');
        }

        let m1;
        let m2;

        // eslint-disable-next-line no-inner-declarations
        function hue() {
            h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
            if (h * 6 < 1) {
                return m1 + (m2 - m1) * h * 6;
            }
            if (h * 2 < 1) {
                return m2;
            }
            if (h * 3 < 2) {
                return m1 + (m2 - m1) * (2 / 3 - h) * 6;
            }

            return m1;
        }

        h = (h % 360) / 360;
        s = clamp(s);
        l = clamp(l);
        a = clamp(a);

        m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        m1 = l * 2 - m2;

        const _rgb = [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255];
        return new Color(_rgb, a, 'hsla');
    } catch (e) {}
}
function _hsla(origColor, hsl) {
    const color = hsla(hsl.h, hsl.s, hsl.l, hsl.a);
    if (color) {
        if (origColor.value && /^(rgb|hsl)/.test(origColor.value)) {
            color.value = origColor.value;
        } else {
            color.value = 'rgb';
        }
        return color;
    }
}

export function rgba(r, g, b, a) {
    try {
        if (r instanceof Color) {
            if (g) {
                a = g;
            } else {
                a = r.alpha;
            }
            return new Color(r.rgb, a, 'rgba');
        }
        const _rgb = [r, g, b];
        return new Color(_rgb, a, 'rgba');
    } catch (e) {}
}

export function rgb(r, g, b) {
    const a = 1;
    const color = rgba(r, g, b, a);
    if (color) {
        color.value = 'rgb';
        return color;
    }
}

function toHSL(color) {
    if (color.toHSL) {
        return color.toHSL();
    }
    throw new Error('Argument cannot be evaluated to a color');
}

export function mix(color1, color2, weight) {
    const p = weight;
    const w = p * 2 - 1;
    const a = toHSL(color1).a - toHSL(color2).a;

    const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    const w2 = 1 - w1;

    const _rgb = [
        color1.rgb[0] * w1 + color2.rgb[0] * w2,
        color1.rgb[1] * w1 + color2.rgb[1] * w2,
        color1.rgb[2] * w1 + color2.rgb[2] * w2,
    ];

    const alpha = color1.alpha * p + color2.alpha * (1 - p);

    return new Color(_rgb, alpha).toHex();
}

function parseColor(color) {
    if (color.startsWith('#')) {
        const _rgb = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
        return new Color(_rgb[1], null, color);
    }
}

export function fade(color, alpha) {
    color = parseColor(color);
    const hsl = toHSL(color);

    hsl.a = alpha;
    hsl.a = clamp(hsl.a);
    return _hsla(color, hsl).toCSS();
}

export function tint(color, amount) {
    color = parseColor(color);
    return mix(rgb(255, 255, 255), color, amount);
}

export function shade(color, amount) {
    color = parseColor(color);
    return mix(rgb(0, 0, 0), color, amount);
}
