import { isNil } from 'lodash-es';
import type { ComponentOptions } from 'vue';

/**
 * 如果传入的值是 Text 对象或 HTMLElement 对象，则直接返回；
 * 如果是 Vue 组件选项对象，则返回它的 DOM 元素；
 * 如果传入 null 参数，则返回 null。
 */
export default function getElementFromVueInstance(
    val?: HTMLElement | ComponentOptions | Text,
) {
    if (!val) return null;
    if (val instanceof Text) return val;
    if (val instanceof HTMLElement) return val;
    if (typeof val === 'object' && !isNil(val.$el)) return val.$el;
    throw new Error(
        'getElementFromVueInstance 传入的值不是 Text、HTMLElement 或 Vue 组件选项对象',
    );
}
