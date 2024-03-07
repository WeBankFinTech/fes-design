export type RemoveReadonly<T> = {
    -readonly [key in keyof T]: T[key];
};

export type RequiredByKeys<T, K> = Omit<
    T & Required<Pick<T, K & keyof T>>,
    never
>;

export type StrictExtract<T, U extends T> = U extends T ? U : never;

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * 将多个数组类型的联合类型，转换成数组成员类型为各数组成员的数组
 *
 * @example
 * ```ts
 * type Result = ArrayUnionToUnionArray<string[] | number[]>;
 * type Result = (string | number)[];
 * ```
 */
export type ArrayUnionToUnionArray<U> = (U extends (infer I)[] ? I : never)[];
