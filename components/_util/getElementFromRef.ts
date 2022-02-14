import type { ComponentOptions } from 'vue';

export default (val?: HTMLElement | ComponentOptions) => {
    if (!val) return null;

    return val instanceof HTMLElement ? val : val.$el;
};
