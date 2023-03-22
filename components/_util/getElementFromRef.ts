import type { ComponentOptions } from 'vue';

export default (val?: HTMLElement | ComponentOptions | Text) => {
    if (!val) return null;
    if (val instanceof Text) return val;
    return val instanceof HTMLElement ? val : val.$el;
};
