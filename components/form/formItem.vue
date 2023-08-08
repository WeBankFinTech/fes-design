<template>
    <div :class="formItemClass">
        <label
            v-if="label || $slots.label"
            :class="formItemLabelClass"
            :style="formItemLabelStyle"
        >
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <div :class="`${prefixCls}-content`">
            <slot />
            <transition name="fes-fade">
                <div v-if="formItemShowMessage" :class="`${prefixCls}-error`">
                    {{ validateMessage }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import {
    provide,
    ref,
    inject,
    computed,
    onBeforeUnmount,
    nextTick,
    defineComponent,
    getCurrentInstance,
} from 'vue';
import Schema from 'async-validator';
import { isArray, cloneDeep, get, set } from 'lodash-es';
import { pxfy } from '../_util/utils';
import getPrefixCls from '../_util/getPrefixCls';
import { FORM_ITEM_INJECTION_KEY } from '../_util/constants';
import {
    provideKey,
    FORM_LAYOUT,
    LABEL_POSITION,
    TRIGGER_TYPE_DEFAULT,
    RULE_TYPE_DEFAULT,
    VALIDATE_STATUS,
    VALIDATE_MESSAGE_DEFAULT,
} from './const';
import { wrapValidator } from './utils';
import { FORM_ITEM_NAME } from './const';
import { formItemProps } from './interface';

const prefixCls = getPrefixCls('form-item');

export default defineComponent({
    name: FORM_ITEM_NAME,
    props: formItemProps,

    setup(props) {
        const {
            model,
            rules,
            layout,
            span,
            inlineItemWidth,
            showMessage,
            labelWidth,
            labelClass,
            labelPosition,
            disabled,
            addField,
            removeField,
        } = inject(provideKey);

        const formItemProp = computed(() => {
            return props.prop || `${prefixCls}_${getCurrentInstance().uid}`;
        });
        const fieldValue = computed(() => {
            // 优先获取 value 的值
            if (props.value !== undefined) return props.value;

            // 不存在时获取 model[prop] 的值
            if (!model.value || !formItemProp.value) return;
            return get(model.value, formItemProp.value);
        });
        const initialValue = cloneDeep(fieldValue.value);
        const formItemRules = computed(() => {
            const _rules = []
                .concat(props.rules || [])
                .concat(get(rules?.value, formItemProp.value) || []);
            return _rules;
        });

        /** 规则校验结果逻辑: 仅存最后一条校验规则的逻辑
         *      存在问题: 如果同时触发两个规则 A|B，规则 A 先触发校验且不通过，接着规则 B 触发校验且通过，规则 A 结果会不展示
         */
        const validateDisabled = ref(false); // 是否触发校验的标志
        const validateStatus = ref(VALIDATE_STATUS.DEFAULT);
        const validateMessage = ref(VALIDATE_MESSAGE_DEFAULT);
        const setValidateInfo = (
            status = VALIDATE_STATUS.DEFAULT,
            message = VALIDATE_MESSAGE_DEFAULT,
        ) => {
            validateStatus.value = status;
            validateMessage.value = message;
        };
        /** 错误展示逻辑: 就近原则【formItem 权重更高】  */
        const formItemShowMessage = computed(
            () =>
                (props.showMessage === null
                    ? showMessage.value
                    : props.showMessage) &&
                validateStatus.value === VALIDATE_STATUS.ERROR,
        );
        const formItemRequired = computed(
            () =>
                formItemRules.value.length > 0 &&
                formItemRules.value.some((_) => _.required),
        );
        const formItemClass = computed(() =>
            [
                prefixCls,
                // inlineFormItem 定宽情况: Form 传入 inlineItemWidth, 此时 inlineItemWidth 优先级最高
                // inlineFormItem 自适应情况: 同时支持 form、formItem 传入 span, 此时 formItem 优先级更高
                layout.value === FORM_LAYOUT.INLINE &&
                    !inlineItemWidth.value &&
                    `${prefixCls}-span-${Math.ceil(props.span || span.value)}`,
                labelPosition.value !== LABEL_POSITION.LEFT &&
                    `${prefixCls}-${labelPosition.value}`,
                formItemRequired.value && 'is-required', // 必填校验: is-required
                validateStatus.value === VALIDATE_STATUS.ERROR && 'is-error', // 校验错误: is-error
            ].filter(Boolean),
        );
        const formItemLabelClass = computed(() =>
            [`${prefixCls}-label`, labelClass.value, props.labelClass].filter(
                Boolean,
            ),
        );
        const formItemLabelStyle = computed(() => ({
            width: pxfy(props.labelWidth || labelWidth.value),
        }));

        /** 校验规则的类型: 默认 String  */
        let ruleDefaultType = RULE_TYPE_DEFAULT;
        const setRuleDefaultType = (val = RULE_TYPE_DEFAULT) => {
            ruleDefaultType = val;
        };
        const validateRules = async (
            trigger: string | string[] = TRIGGER_TYPE_DEFAULT,
        ) => {
            if (validateDisabled.value) {
                validateDisabled.value = false;
                return;
            }

            /** 过滤符合条件的 triggersRules
             *
             *  未指定具体 trigger 类型，则直接返回 rule 规则
             *  指定具体 trigger 类型:
             *     当 rule.trigger 未填写时, 则直接返回 rule 规则【没写 trigger 默认各种类型都可以触发该规则】
             *     当 rule.trigger 填写时, 需要按指定类型过滤【分 Array| String】
             */
            const triggersRules = !trigger
                ? formItemRules.value
                : formItemRules.value.filter(
                      (rule) =>
                          !rule.trigger ||
                          (isArray(rule.trigger)
                              ? rule.trigger.includes(trigger)
                              : rule.trigger === trigger),
                  );

            // 处理 rule 规则里面是自定义 validator
            const activeRules = triggersRules.map((rule) => {
                const shallowClonedRule = Object.assign({}, rule);
                if (shallowClonedRule.validator) {
                    shallowClonedRule.validator = wrapValidator(
                        shallowClonedRule.validator,
                        false,
                    );
                }
                if (shallowClonedRule.asyncValidator) {
                    shallowClonedRule.asyncValidator = wrapValidator(
                        shallowClonedRule.asyncValidator,
                        true,
                    );
                }
                if (!shallowClonedRule.type) {
                    shallowClonedRule.type = ruleDefaultType;
                }
                return shallowClonedRule;
            });

            if (!activeRules.length) return Promise.resolve();

            // 开始规则校验
            const descriptor: any = {};
            descriptor[formItemProp.value] = activeRules;
            const validatorModel: any = {};
            validatorModel[formItemProp.value] = fieldValue.value;
            const validator = new Schema(descriptor);

            try {
                await Promise.resolve(validator.validate(validatorModel));
                setValidateInfo(VALIDATE_STATUS.SUCCESS);
            } catch (errObj: any) {
                if (errObj.errors) {
                    const error = errObj.errors[0];
                    setValidateInfo(VALIDATE_STATUS.ERROR, error.message);
                    return Promise.reject([
                        { ...error, message: error.message },
                    ]);
                }
            }
        };

        // 验证表单项
        const validate = async (trigger = TRIGGER_TYPE_DEFAULT) => {
            try {
                await validateRules(trigger);
            } catch (err) {}
        };
        const clearValidate = () => {
            setValidateInfo();
            validateDisabled.value = false;
        };
        const resetField = () => {
            setValidateInfo();
            validateDisabled.value = true; // 在表单重置行为，不应触发校验

            // reset initialValue
            set(model.value, formItemProp.value, cloneDeep(initialValue));

            // reset validateDisabled after onFieldChange triggered
            nextTick(() => {
                validateDisabled.value = false;
            });
        };

        addField(formItemProp.value, {
            prop: formItemProp.value,
            value: fieldValue.value,
            rules: formItemRules.value,
            validateRules,
            clearValidate,
            resetField,
        });
        onBeforeUnmount(() => {
            removeField(formItemProp.value);
        });

        provide(FORM_ITEM_INJECTION_KEY, {
            validate,
            setRuleDefaultType,
            isError: computed(() => {
                return validateStatus.value === VALIDATE_STATUS.ERROR;
            }),
            isFormDisabled: disabled,
        });

        return {
            prefixCls,

            formItemClass,
            formItemLabelClass,
            formItemLabelStyle,
            formItemShowMessage,
            validateMessage,

            validate,
            clearValidate,
        };
    },
});
</script>
