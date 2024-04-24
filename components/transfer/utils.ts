import { COMPONENT_CLASS } from './const';
import type { TransferFilter, TransferOption } from './interface';

export const cls = (appendClass: string): string =>
    `${COMPONENT_CLASS}-${appendClass}`;

export const defaultFilter: TransferFilter = (filterText, option) =>
    option.label.includes(filterText);

export const isTree = (options: TransferOption[]): boolean =>
    options.some((o) => Array.isArray(o.children) && o.children.length > 0);

export const flattenTree = (options: TransferOption[]): TransferOption[] => {
    const result: TransferOption[] = [];
    options.forEach((o) => {
        result.push(o);
        if (Array.isArray(o.children) && o.children.length > 0) {
            result.push(...flattenTree(o.children));
        }
    });
    return result;
};
