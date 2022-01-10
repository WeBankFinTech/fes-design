export { default as zhCN } from './lang/zhCN';
export { default as enUS } from './lang/enUS';

export type TypeTranslatePair = {
    [key: string]: string | string[] | TypeTranslatePair;
};

export type TypeLanguage = {
    name: string;
    [key: string]: string | string[] | TypeTranslatePair;
};
