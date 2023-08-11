<template>
    <form :class="formClass" :style="formStyle" @submit="handleSubmit">
        <slot />
    </form>
</template>

<script lang="ts">
import { provide, toRefs, computed, defineComponent } from 'vue';
import { pxfy } from '../_util/utils';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { provideKey, FORM_LAYOUT, TRIGGER_TYPE_DEFAULT } from './const';
import { allPromiseFinish } from './utils';
import { FORM_NAME } from './const';
import { formProps } from './interface';
import type { Field, ValidateResult } from './interface';

const prefixCls = getPrefixCls('form');

export default defineComponent({
    name: FORM_NAME,
    props: formProps,
    emits: ['submit'],
    setup(props, { emit }) {
        useTheme();

        const formFields: {
            [key: string]: Field;
        } = {};
        const formClass = computed(() => [
            prefixCls,
            `${prefixCls}-${props.layout}`,
            props.disabled && `${prefixCls}-disabled`, // disabled
        ]);
        const formStyle = computed(() => {
            const tempColStyle = props.layout === FORM_LAYOUT.INLINE &&
                props.inlineItemWidth && {
                    'grid-template-columns': `repeat(auto-fit, ${pxfy(
                        props.inlineItemWidth,
                    )})`,
                };
            const gapStyle = props.layout === FORM_LAYOUT.INLINE &&
                props.inlineItemGap && {
                    'grid-gap': `${pxfy(props.inlineItemGap)}`,
                };
            return { ...tempColStyle, ...gapStyle };
        });

        const addField = (formItemProp: string, formItemContext: Field) => {
            if (formItemProp) formFields[formItemProp] = formItemContext;
        };
        const removeField = (formItemProp: string) => {
            delete formFields[formItemProp];
        };
        const validateFields = async (
            fieldProps?: string[],
            trigger = TRIGGER_TYPE_DEFAULT,
        ) => {
            if (!props.model)
                return Promise.reject(
                    'Form `model` is required for resetFields to work.',
                );
            const specifyPropsFlag = Boolean(fieldProps.length); // 是否指定prop: 【部分】表单字段校验调用会指定; 【整个】表单校验调用则不会指定
            const promiseList: Promise<any>[] = []; // 原始校验结果

            Object.values(formFields).forEach((formField) => {
                if (specifyPropsFlag && !fieldProps.includes(formField.prop))
                    return; // Skip if Specify prop but not include

                const promise = formField.validateRules(trigger);
                promiseList.push(
                    promise
                        .then(() => ({ name: formField.prop, errors: [] }))
                        .catch((errors) =>
                            Promise.reject({ name: formField.prop, errors }),
                        ),
                );
            });

            try {
                return await allPromiseFinish(promiseList); // 汇总校验结果;
            } catch (results: any) {
                const errorList: ValidateResult[] = [];
                const errorNameList: string[] = [];
                results?.forEach((result: ValidateResult) => {
                    if (result?.errors?.length) {
                        errorList.push(result);
                        errorNameList.push(result?.name);
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
         *    fieldProps { string[] }    指定校验字段的 props 数组
         *    return    { Promise }   校验结果
         */
        const validate = (fieldProps: string[] = []) =>
            validateFields(fieldProps);

        /** 移除表单项的校验结果 */
        const clearValidate = () => {
            if (!props.model)
                return Promise.reject(
                    'Form `model` is required for resetFields to work.',
                );
            Object.values(formFields).forEach((formField) => {
                formField.clearValidate();
            });
        };

        /** 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 */
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

        const handleSubmit = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            emit('submit', e);
        };

        return {
            formClass,
            formStyle,

            validate,
            clearValidate,
            resetFields,
            handleSubmit,
        };
    },
});
</script>
