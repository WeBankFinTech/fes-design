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
