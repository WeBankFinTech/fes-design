<template>
    <div :class="formItemClass">
        <label v-if="label || $slots.label" :class="formItemLabelClass" :style="formItemLabelStyle">
            <slot name="label">
                {{label}}
            </slot>
        </label>
        <div :class="`${prefixCls}-content`">
            <slot />
            <div v-if="formItemShowMessage && validateStatus === VALIDATE_STATUS.ERROR" :class="`${prefixCls}-error`">
                {{validateMessage}}
            </div>
        </div>
    </div>
</template>
<script>
import {
    provide, ref, inject, defineComponent, computed, onBeforeUnmount,
} from 'vue';
import Schema from 'async-validator';
import { isArray, cloneDeep } from 'lodash-es';
import { addUnit } from '../_util/utils';
import {
    provideKey, FORM_ITEM_NAME, LABEL_POSITION, TRIGGER_DEFAULT, VALIDATE_STATUS, VALIDATE_MESSAGE_DEFAULT
} from './const';
import getPrefixCls from '../_util/getPrefixCls';
import { FORMITEM_INJECTION_KEY } from '../_util/constants';
import { wrapValidator, getNamePath, getPropByPath } from './utils';

const prefixCls = getPrefixCls('form-item');

export default defineComponent({
    name: FORM_ITEM_NAME,
    props: {
        prop: String,
        label: String,
        labelWidth: [String, Number],
        labelClass: String,
        showMessage: {
            type: Boolean,
            default: null,
        },
        rules: {
            type: Array,
            default: [],
        },
    },
    setup(props) {
        const {
            model,
            rules,
            showMessage,
            labelWidth,
            labelClass,
            labelPosition,
            addField,
            removeField,
        } = inject(provideKey);

        const namePath = computed(() => getNamePath(props.prop));
        const fieldValue = computed(() => {
            if (!model.value || !props.prop) return;
            return getPropByPath(model.value, namePath.value, true).v;
        });
        const initialValue = ref(cloneDeep(fieldValue.value));
        const formItemRules = computed(() => ([].concat(props.rules || []).concat((rules?.value?.[props.prop]) || [])));

        /** 规则校验结果逻辑: 仅存最后一条校验规则的逻辑
         *      存在问题: 如果同时触发两个规则 A|B，规则 A 先触发校验且不通过，接着规则 B 触发校验且通过，规则 A 结果会不展示
         */
        const validateStatus = ref(VALIDATE_STATUS.DEFAULT);
        const validateMessage = ref(VALIDATE_MESSAGE_DEFAULT);
        const setValidateInfo = (status = VALIDATE_STATUS.DEFAULT, message = VALIDATE_MESSAGE_DEFAULT) => {
            validateStatus.value = status;
            validateMessage.value = message;
        };
        /** 错误展示逻辑: 就近原则【formItem 权重更高】  */
        const formItemShowMessage = computed(() => (props.showMessage === null ? showMessage.value : props.showMessage));
        const formItemRequired = computed(() => (formItemRules.value.length > 0 && formItemRules.value.some(_ => _.required)));
        const formItemClass = computed(() => [
                prefixCls,
                labelPosition.value !== LABEL_POSITION.LEFT && `${prefixCls}-${labelPosition.value}`,
                formItemRequired.value && 'is-required', // 必填校验: is-required
                validateStatus.value === VALIDATE_STATUS.ERROR && 'is-error' // 校验错误: is-error
            ].filter(Boolean)
        );
        const formItemLabelClass = computed(() => ([`${prefixCls}-label`, labelClass.value, props.labelClass].filter(Boolean)));
        const formItemLabelStyle = computed(() => ({ width: addUnit(props.labelWidth || labelWidth.value) }));

        let ruleDefaultType = 'string';
        const setRuleDefaultType = (val) => {
            ruleDefaultType = val;
        };
        const validateRules = async (trigger = TRIGGER_DEFAULT) => {
            /** 过滤符合条件的 triggersRules
             *
             *  未指定具体 trigger 类型，则直接返回 rule 规则
             *  指定具体 trigger 类型:
             *     当 rule.trigger 未填写时, 则直接返回 rule 规则【没写 trigger 默认各种类型都可以触发该规则】
             *     当 rule.trigger 填写时, 需要按指定类型过滤【分 Array| String】
             */
            const triggersRules = !trigger ? formItemRules.value : formItemRules.value.filter(rule => !rule.trigger || (isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger));

            // 处理 rule 规则里面是自定义 validator
            const activeRules = triggersRules.map((rule) => {
                const shallowClonedRule = Object.assign({}, rule);
                if (shallowClonedRule.validator) {
                    shallowClonedRule.validator = wrapValidator(
                        shallowClonedRule.validator, false,
                    );
                }
                if (shallowClonedRule.asyncValidator) {
                    shallowClonedRule.asyncValidator = wrapValidator(
                        shallowClonedRule.asyncValidator, true,
                    );
                }
                if (!shallowClonedRule.type) {
                    shallowClonedRule.type = ruleDefaultType;
                }
                return shallowClonedRule;
            });

            if (!activeRules.length) return Promise.resolve();

            setValidateInfo(VALIDATE_STATUS.VALIDATING);
            const descriptor = {};
            descriptor[props.prop] = activeRules;
            const validatorModel = {};
            validatorModel[props.prop] = fieldValue.value;
            const validator = new Schema(descriptor);
            try {
                await Promise.resolve(validator.validate(validatorModel));
            } catch (errObj) {
                if (errObj.errors) {
                    const error = errObj.errors[0];
                    setValidateInfo(VALIDATE_STATUS.ERROR, error.message);
                    return Promise.reject([{ ...error, message: error.message }]);
                }
            }
        };

        // 验证表单项
        const validate = (trigger = TRIGGER_DEFAULT) => validateRules(trigger);
        const clearValidate = () => setValidateInfo();
        const resetField = () => {
            clearValidate();
            const prop = getPropByPath(model.value || {}, namePath.value, true);
            if (Array.isArray(fieldValue.value)) {
                prop.o[prop.k] = [].concat(initialValue.value);
            } else {
                prop.o[prop.k] = initialValue.value;
            }
        };

        addField(props.prop, {
            prop: props.prop,
            value: fieldValue.value,
            rules: formItemRules.value || [],
            validateRules,
            clearValidate,
            resetField,
        });
        onBeforeUnmount(() => {
            removeField(props.prop);
        });


        provide(FORMITEM_INJECTION_KEY, { validate, setRuleDefaultType });
        return {
            prefixCls,
            VALIDATE_STATUS,
            validateStatus,
            validateMessage,
            formItemClass,
            formItemRequired,
            formItemShowMessage,
            formItemLabelClass,
            formItemLabelStyle,
            validateRules,
            validate,
        };
    },
});
</script>
