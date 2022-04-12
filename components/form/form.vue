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
    model?: object;
    rules?: object;
    layout?: FORM_LAYOUT;
    labelPosition?: LABEL_POSITION;
    showMessage?: boolean;
    labelWidth?: string | number;
    labelClass?: string;
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
    fieldProps?: string[],
    trigger = TRIGGER_TYPE_DEFAULT,
    customizeRule = []
) => {    
    if (!props.model)
        return Promise.reject(
            'Form `model` is required for resetFields to work.',
        );
    const specifyPropsFlag: boolean = Boolean(fieldProps.length); // 是否指定prop: 【部分】表单字段校验调用会指定; 【整个】表单校验调用则不会指定

    const promiseList: Promise<any>[] = []; // 原始校验结果
    Object.values(formFields).forEach((formField) => {

        if (specifyPropsFlag && !fieldProps.includes(formField.prop)) return; // Skip if Specify prop but not include

        if (!formField.rules.length && !customizeRule.length) return; // Skip if without formField.rules or customizeRule

        const promise = formField.validateRules(trigger, customizeRule);
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

/** 表单校验
 *    fieldProps { string|string[] }  指定校验字段的 props (数组)
 *    trigger { string }  指定校验字段的 trigger 类型
 *    customizeRule { Object[] }  指定校验字段的自定义规则
 *    return    { Promise }    校验结果
 */
const validate = (fieldProps = [], trigger = TRIGGER_TYPE_DEFAULT, customizeRule = []) => validateFields(fieldProps, trigger, customizeRule);

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
});

defineExpose({
    validate,
    clearValidate,
    resetFields,
});
</script>

<script lang="ts">
import { FORM_NAME } from './const';
export default {
    name: FORM_NAME,
};
</script>
