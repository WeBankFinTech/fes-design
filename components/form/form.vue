<template>
    <form :class="formClass" :style="formStyle">
        <slot />
    </form>
</template>

<script lang="ts">
import { provide, toRefs, computed, defineComponent, PropType } from 'vue';
import {
    provideKey,
    FORM_LAYOUT,
    LABEL_POSITION,
    TRIGGER_TYPE_DEFAULT,
} from './const';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { allPromiseFinish } from './utils';
import { FORM_NAME, GRID_GAP_DEFAULT } from './const';
import type { Field, ValidateResult } from './interface';

const prefixCls = getPrefixCls('form');

const formProps = {
    model: Object,
    rules: {
        type: Object,
        default: () => ({}),
    },
    layout: {
        type: String as PropType<typeof FORM_LAYOUT[keyof typeof FORM_LAYOUT]>,
        default: FORM_LAYOUT.HORIZONTAL,
    },
    inlineMinWidth: [String, Number] as PropType<string | number>,
    labelPosition: {
        type: String as PropType<
            typeof LABEL_POSITION[keyof typeof LABEL_POSITION]
        >,
        default: LABEL_POSITION.LEFT,
    },
    showMessage: {
        type: Boolean,
        default: true,
    },
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
} as const;

export default defineComponent({
    name: FORM_NAME,
    props: formProps,
    setup(props) {
        useTheme();

        const formFields: {
            [key: string]: Field;
        } = {};
        const formClass = computed(() => [
            prefixCls,
            `${prefixCls}-${props.layout}`,
        ]);
        const formStyle = computed(() => ((props.layout === FORM_LAYOUT.INLINE && props.inlineMinWidth) && {
            'grid-template-columns': `repeat(auto-fit, minmax(calc(${props.inlineMinWidth} - ${GRID_GAP_DEFAULT}), 1fr))`
        }));

        const addField = (formItemProp: string, formItemContext: Field) => {
            formItemProp && (formFields[formItemProp] = formItemContext);
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

        return {
            formClass,
            formStyle,

            validate,
            clearValidate,
            resetFields,
        };
    },
});
</script>
