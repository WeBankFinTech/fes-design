import type { ValidateResult } from './interface';

// wrap sync validator
export function wrapValidator(
    validator: (...args: any[]) => boolean | Promise<any>,
    async: boolean,
) {
    return (...args: any[]) => {
        try {
            const validateResult = validator(...args);
            if (
                (!async &&
                    (typeof validateResult === 'boolean' ||
                        validateResult instanceof Error ||
                        Array.isArray(validateResult))) || // Error[]
                (typeof validateResult !== 'boolean' && validateResult?.then)
            ) {
                return validateResult;
            }
            if (typeof validateResult === 'undefined') {
                return true;
            }
            console.warn(
                'form-item/validate',
                `You return a ${typeof validateResult} typed value in the validator method, which is not recommended. Please use ${
                    async ? '`Promise`' : '`boolean`, `Error` or `Promise`'
                } typed value instead.`,
            );
            return true;
        } catch (err) {
            console.warn(
                'form-item/validate',
                'An error is catched in the validation, ' +
                    "so the validation won't be done. Your callback in `validate` method of " +
                    "`form` or `form-item` won't be called in this validation.",
            );
            console.error(err);
            // If returns undefined, async-validator won't trigger callback
            // so the result will be abandoned, which means not true and not false
            return 'undefined';
        }
    };
}

export function allPromiseFinish(promiseList: Promise<any>[]) {
    if (!promiseList.length) return Promise.resolve([]);

    let hasError = false;
    let count = promiseList.length;
    const results: ValidateResult[] = [];

    return new Promise((resolve, reject) => {
        promiseList.forEach((promise, index) => {
            promise
                .catch((e) => {
                    hasError = true;
                    return e;
                })
                .then((result) => {
                    count -= 1;
                    results[index] = result;

                    if (count > 0) return;

                    if (hasError) reject(results);

                    resolve(results);
                });
        });
    });
}

export function toArray(value: any) {
    if (value === 'undefined' || value === null) return [];
    return Array.isArray(value) ? value : [value];
}

/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export function getNamePath(path: string) {
    return toArray(path);
}

export function getPropByPath(
    obj: object,
    namePathList: any[],
    strict: boolean,
) {
    let tempObj: {
        [key: string]: any;
    } = obj;

    const keyArr = namePathList;
    let i = 0;
    try {
        for (let len = keyArr.length; i < len - 1; ++i) {
            if (!tempObj && !strict) break;
            const key = keyArr[i];
            // TODO 后续优化，建议改成 lodash 的 get
            // eslint-disable-next-line
            if (key in tempObj) {
                tempObj = tempObj[key];
            } else {
                if (strict) {
                    throw Error(
                        'please transfer a valid name path to form item!',
                    );
                }
                break;
            }
        }
        if (strict && !tempObj) {
            throw Error('please transfer a valid name path to form item!');
        }
    } catch (error) {
        console.error('please transfer a valid name path to form item!');
    }

    return {
        o: tempObj,
        k: keyArr[i],
        v: tempObj ? tempObj[keyArr[i]] : 'undefined',
    };
}
