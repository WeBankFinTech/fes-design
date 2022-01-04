function clamp(v: number, max: number) {
    return Math.min(Math.max(v, 0), max);
}

function toHex(v: number[]) {
    return `#${v
        .map((c) => {
            c = clamp(Math.round(c), 255);
            return (c < 16 ? '0' : '') + c.toString(16);
        })
        .join('')}`;
}

class Color {
    rgb: number[];
    alpha = 0;
    value = '';
    constructor(
        rgb: string | Array<number>,
        a?: number,
        originalForm?: string,
    ) {
        if (Array.isArray(rgb)) {
            this.rgb = rgb;
        } else if (rgb.length >= 6) {
            this.rgb = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            rgb.match(/.{2}/g)!.forEach((c, i) => {
                if (i < 3) {
                    this.rgb.push(parseInt(c, 16));
                } else {
                    this.alpha = parseInt(c, 16) / 255;
                }
            });
        } else {
            this.rgb = [];
            rgb.split('').forEach((c, i) => {
                if (i < 3) {
                    this.rgb.push(parseInt(c + c, 16));
                } else {
                    this.alpha = parseInt(c + c, 16) / 255;
                }
            });
        }
        this.alpha = this.alpha || (typeof a === 'number' ? a : 1);
        if (typeof originalForm !== 'undefined') {
            this.value = originalForm;
        }
    }

    toRGB() {
        return toHex(this.rgb);
    }

    toCSS(compress?: boolean) {
        let color: string;
        let colorFunction = '';
        let args: number[] = [];

        // `value` is set if this color was originally
        // converted from a named color string so we need
        // to respect this and try to output named color too.
        const alpha = this.alpha;

        if (this.value) {
            if (this.value.indexOf('rgb') === 0) {
                if (alpha < 1) {
                    colorFunction = 'rgba';
                }
            } else if (this.value.indexOf('hsl') === 0) {
                if (alpha < 1) {
                    colorFunction = 'hsla';
                } else {
                    colorFunction = 'hsl';
                }
            } else {
                return this.value;
            }
        } else {
            if (alpha < 1) {
                colorFunction = 'rgba';
            }
        }

        // eslint-disable-next-line default-case
        switch (colorFunction) {
            case 'rgba':
                args = this.rgb
                    .map((c) => clamp(Math.round(c), 255))
                    .concat(clamp(alpha, 1));
                break;
            case 'hsla':
                args.push(clamp(alpha, 1));
        }

        if (colorFunction) {
            // Values are capped between `0` and `255`, rounded and zero-padded.
            return `${colorFunction}(${args.join(`,${compress ? '' : ' '}`)})`;
        }

        color = this.toRGB();

        if (compress) {
            const splitcolor = color.split('');

            // Convert color to short format
            if (
                splitcolor[1] === splitcolor[2] &&
                splitcolor[3] === splitcolor[4] &&
                splitcolor[5] === splitcolor[6]
            ) {
                color = `#${splitcolor[1]}${splitcolor[3]}${splitcolor[5]}`;
            }
        }

        return color;
    }

    toHex() {
        return toHex(this.rgb);
    }

    toHSL() {
        const r = this.rgb[0] / 255,
            g = this.rgb[1] / 255,
            b = this.rgb[2] / 255,
            a = this.alpha;

        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h = 0;
        let s: number;
        const l = (max + min) / 2;
        const d = max - min;

        if (max === min) {
            h = s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            // eslint-disable-next-line default-case
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return { h: h * 360, s, l, a };
    }
}

export default Color;
