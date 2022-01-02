<template>
    <form :class="formClass">
        <slot />
    </form>
</template>

<script setup lang="ts">
import { provide, toRefs, computed } from 'vue';
import {
    provideKey,
    FORM_LAYOUT,
    LABEL_POSITION,
    TRIGGER_TYPE_DEFAULT,
} from './const';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { allPromiseFinish } from './utils';

import type { Field, ValidateResult } from './interface';

const prefixCls = getPrefixCls('form');

interface FormProps {
    model: object;
    rules: object;
    layout: FORM_LAYOUT;
    labelPosition: LABEL_POSITION;
    showMessage: boolean;
    labelWidth: string | number;
    labelClass: string;
}

const props = withDefaults(defineProps<FormProps>(), {
    layout: FORM_LAYOUT.HORIZONTAL,
    labelPosition: LABEL_POSITION.LEFT,
    showMessage: true,
});

useTheme();

const formFields: {
    [key: string]: Field;
} = {};
const formClass = computed(() => [prefixCls, `${prefixCls}-${props.layout}`]);

const addField = (formItemProp: string, formItemContext: Field) => {
    formItemProp && (formFields[formItemProp] = formItemContext);
};
const removeField = (formItemProp: string) => {
    delete formFields[formItemProp];
};

const validateFields = async (
    fieldProps?: string,
    trigger = TRIGGER_TYPE_DEFAULT,
) => {
    if (!props.model)
        return Promise.reject(
            'Form `model` is required for resetFields to work.',
        );
    const specifyProps = !!fieldProps; // 是否指定 prop: validateField() 调用会指定; validate() 调用不会指定

    const promiseList: Promise<any>[] = []; // 原始校验结果
    Object.values(formFields).forEach((formField) => {
        if (!formField.rules.length) return; // Skip if without rule
        if (specifyProps && formField.prop !== fieldProps) return; // Skip if Specify prop but not equal

        const promise = formField.validateRules(trigger);
        promiseList.push(
            promise
                .then(() => ({ name: formField.prop, errors: [] }))
                .catch((errors) =>
                    Promise.reject({ name: formField.prop, errors }),
                ),
        );
    });
    const summaryPromise = allPromiseFinish(promiseList); // 汇总校验结果

    try {
        await summaryPromise;
    } catch (results: any) {
        const errorList: ValidateResult[] = [];
        const errorNameList: string[] = [];
        results.length &&
            results.forEach((result: ValidateResult) => {
                if (result && result.errors.length) {
                    errorList.push(result);
                    errorNameList.push(result.name);
                }
            });
        return Promise.reject({
            valid: false,
            values: errorNameList,
            errorFields: errorList,
        });
    }
};

/** 对部分表单字段进行校验
 *    fieldProp { String }    指定校验字段的 props
 *    trigger   { Object }    指定 trigger, 该表单项指定 trigger 相关的规则都会使用; 不指定 trigger, 直接用表单项的所有规则
 *    return    { Promise }   校验结果
 */
const validateField = (fieldProp = '', trigger = TRIGGER_TYPE_DEFAULT) => {
    if (!fieldProp)
        return Promise.reject('`prop` is required for validateField to work.');
    return validateFields(fieldProp, trigger);
};

// 对整个表单进行校验，返回一个 promise
const validate = () => validateFields();

// 移除表单项的校验结果
const clearValidate = () => {
    if (!props.model)
        return Promise.reject(
            'Form `model` is required for resetFields to work.',
        );
    Object.values(formFields).forEach((formField) => {
        formField.clearValidate();
    });
};

// 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
const resetFields = () => {
    if (!props.model)
        return Promise.reject(
            'Form `model` is required for resetFields to work.',
        );
    Object.values(formFields).forEach((formField) => {
        formField.resetField();
    });
};

provide(provideKey, {
    ...toRefs(props),
    addField,
    removeField,
    validateField,
});

defineExpose({
    validate,
    clearValidate,
    resetFields,
});
</script>

<script>
import { FORM_NAME } from './const';
export default {
    name: FORM_NAME,
};
</script>
