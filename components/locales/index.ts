export { default as zhCN } from './lang/zhCN';
export { default as enUS } from './lang/enUS';

export interface TypeTranslatePair {
    [key: string]: string | string[] | TypeTranslatePair;
}

export interface TypeLanguage {
    name: string;
    [key: string]: string | string[] | TypeTranslatePair;
}
