import type { PropType } from 'vue';

export const definePropType = <T>(val: any): PropType<T> => val;

export const generateId = (): number => Math.floor(Math.random() * 10000);

export const collapseContextKey = Symbol('collapseContextKey');

export const arrowPositionKey = Symbol('arrow_position');
