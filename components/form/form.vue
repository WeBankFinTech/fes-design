<template>
    <form :class="formClass">
        <slot />
    </form>
</template>
<script>
import { provide, toRefs, defineComponent, computed } from 'vue';
import {
    provideKey,
    FORM_NAME,
    FORM_LAYOUT,
    LABEL_POSITION,
    TRIGGER_DEFAULT,
} from './const';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { allPromiseFinish } from './utils';

const prefixCls = getPrefixCls('form');

export default defineComponent({
    name: FORM_NAME,
    props: {
        model: Object,
        rules: Object,
        layout: {
            type: String,
            default: FORM_LAYOUT.HORIZONTAL,
            validator(value) {
                return Object.values(FORM_LAYOUT).indexOf(value) !== -1;
            },
        },
        labelPosition: {
            type: String,
            default: LABEL_POSITION.LEFT,
            validator(value) {
                return Object.values(LABEL_POSITION).indexOf(value) !== -1;
            },
        },
        showMessage: {
            type: Boolean,
            default: true,
        },
        labelWidth: [String, Number],
        labelMarginRight: [String, Number],
    },

    setup(props) {
        useTheme();
        const formFields = {};
        const formClass = computed(() => [
            prefixCls,
            `${prefixCls}-${props.layout}`,
        ]);

        const addField = (formItemProp, formItemContext) => {
            formItemProp && (formFields[formItemProp] = formItemContext);
        };
        const removeField = (formItemProp) => {
            delete formFields[formItemProp];
        };

        const validateFields = async (
            fieldProps,
            triggers = TRIGGER_DEFAULT,
        ) => {
            if (!props.model)
                return Promise.reject(
                    'Form `model` is required for resetFields to work.',
                );
            const specifyProps = !!fieldProps; // 是否指定 prop: validateField() 调用会指定; validate() 调用不会指定

            const promiseList = []; // 原始校验结果
            Object.values(formFields).forEach((formField) => {
                if (!formField.rules.length) return; // Skip if without rule
                if (specifyProps && formField.prop !== fieldProps) return; // Skip if Specify prop but not equal

                const promise = formField.validateRules(triggers);
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
            } catch (results) {
                const errorList = [];
                const errorNameList = [];
                results.length &&
                    results.forEach((result) => {
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
        const validateField = (fieldProp = '', triggers = TRIGGER_DEFAULT) => {
            if (!fieldProp)
                return Promise.reject(
                    '`prop` is required for validateField to work.',
                );
            return validateFields(fieldProp, triggers);
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

        return {
            formClass,
            validate,
            clearValidate,
            resetFields,
        };
    },
});
</script>
