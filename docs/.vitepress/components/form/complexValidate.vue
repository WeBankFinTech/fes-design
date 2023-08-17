<template>
    <FForm
        ref="WFormDomRef"
        labelWidth="140px"
        labelPosition="right"
        :model="modelForm"
        :rules="rules"
    >
        <div class="complex-validate-item">
            <MoreCircleFilled /> 自定义 trigger、validator 场景:
        </div>
        <FFormItem label="密码" prop="password">
            <FInput
                v-model="modelForm.password"
                type="password"
                showPassword
                placeholder="请输入密码"
                @input="handlePasswordInput"
            ></FInput>
        </FFormItem>
        <FFormItem ref="rePasswordRef" label="再次输入" prop="rePassword">
            <FInput
                v-model="modelForm.rePassword"
                type="password"
                showPassword
                placeholder="请再次输入密码"
            ></FInput>
        </FFormItem>

        <div class="complex-validate-item">
            <MoreCircleFilled /> 联动校验场景:
        </div>
        <FFormItem label="类型选择" prop="type">
            <FRadioGroup v-model="modelForm.type">
                <FRadio value="admin">admin</FRadio>
                <FRadio value="edit">edit</FRadio>
                <FRadio value="run">run</FRadio>
            </FRadioGroup>
        </FFormItem>
        <!-- 在 FForm 维度【全局rules】绑定联动规则  -->
        <FFormItem
            v-if="modelForm.type === 'admin'"
            label="admin 详情"
            prop="adminDesc"
        >
            <FInput
                v-model="modelForm.adminDesc"
                placeholder="请输入adminDesc【在 FForm 维度绑定联动规则】"
            ></FInput>
        </FFormItem>
        <!-- 在 FFormItem 维度绑定联动规则  -->
        <FFormItem
            v-if="modelForm.type === 'edit'"
            label="edit 详情"
            prop="editDesc"
            :rules="
                modelForm.type === 'edit'
                    ? [{ required: true, message: '请输入editDesc' }]
                    : []
            "
        >
            <FInput
                v-model="modelForm.editDesc"
                placeholder="请输入editDesc【在 FFormItem 维度绑定联动规则】"
            ></FInput>
        </FFormItem>

        <div class="complex-validate-item">
            <MoreCircleFilled /> v-for 任意添加选项场景校验:
        </div>
        <FFormItem
            v-for="(item, index) in modelForm.options"
            :key="index"
            :label="item.label"
            :prop="`options[${index}].value`"
            :rules="[{ required: index % 2 !== 0, message: '请输入选项值' }]"
        >
            <FSpace>
                <FInput
                    v-model="modelForm.options[index].value"
                    placeholder="请输入选项"
                ></FInput>
                <PlusSquareOutlined @click="addOptionItem" />
            </FSpace>
        </FFormItem>

        <div class="complex-validate-item">
            <MoreCircleFilled /> v-for 动态 ref 校验:
        </div>
        <div
            v-for="(item, index) in modelForm.scenes"
            :key="index"
            style="display: flex; margin-left: 65px"
        >
            {{ `场景${index + 1}名称：` }}
            <FFormItem :prop="`scenes[${index}].name`">
                <FInput
                    v-model="modelForm.scenes[index].name"
                    :maxlength="10"
                    @input="validateScenesCont(index)"
                />
            </FFormItem>
            <span style="margin-left: 10px">内容：</span>
            <FFormItem
                :ref="(el) => (scenesDomRef[index] = el)"
                :prop="`scenes[${index}].content`"
                :rules="
                    modelForm.scenes[index].name
                        ? [{ required: true, message: '' }]
                        : []
                "
            >
                <FInput
                    v-model="modelForm.scenes[index].content"
                    :maxlength="10"
                    :placeholder="`名称${index + 1}填写，内容必填`"
                />
            </FFormItem>
        </div>

        <FFormItem label=" ">
            <FButton
                type="primary"
                style="margin-right: 20px"
                @click="submitHandler"
            >
                提交
            </FButton>
            <FButton
                type="primary"
                style="margin-right: 20px"
                @click="clearHandler"
            >
                清除
            </FButton>
            <FButton type="primary" @click="resetHandler">重置</FButton>
        </FFormItem>
    </FForm>
</template>

<script>
import { ref, reactive, computed } from 'vue';

export default {
    setup() {
        const WFormDomRef = ref(null);
        const rePasswordRef = ref(null);
        const modelForm = reactive({
            password: '',
            rePassword: '',
            type: 'admin',
            typeDesc: '',
            options: [{ label: '选项1', value: '' }],
            scenes: [
                { name: '', content: '' },
                { name: '', content: '' },
            ],
        });
        const scenesDomRef = ref([]);

        const validatePasswordStartWith = (rule, value) => {
            return Boolean(
                modelForm.password &&
                    modelForm.password.startsWith(value) &&
                    modelForm.password.length >= value.length,
            );
        };
        const rules = computed(() => {
            return {
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: ['blur', 'change'],
                    },
                ],
                rePassword: [
                    {
                        required: true,
                        message: '请再次输入密码',
                        trigger: ['change', 'blur'],
                    },
                    {
                        validator: validatePasswordStartWith,
                        message: '再次输入密码时，两次密码输入不一致',
                        trigger: ['change'],
                    },
                    {
                        validator: (rule, value) =>
                            value === modelForm.password,
                        message: '输入密码时，两次密码输入不一致',
                        trigger: 'password-input',
                    },
                ],
                adminDesc: [
                    modelForm.type === 'admin' && {
                        required: true,
                        message: '请输入adminDesc',
                        trigger: ['change', 'blur'],
                    },
                ],
            };
        });

        // 调用自定义的 password-input trigger
        const handlePasswordInput = () => {
            if (modelForm.rePassword) {
                rePasswordRef.value.validate('password-input');
            }
        };

        const addOptionItem = () => {
            modelForm.options.push({
                label: `选项${modelForm.options.length + 1}`,
                value: '',
            });
        };

        const validateScenesCont = (index) => {
            // 通过 FFormItem 的动态 ref 调用 validate 校验
            modelForm?.scenes[index]?.name
                ? scenesDomRef.value[index].validate()
                : scenesDomRef.value[index].clearValidate();
        };

        const submitHandler = async () => {
            // 通过 FForm 的 validate 直接校验
            try {
                await WFormDomRef.value.validate();
                console.log(
                    '[form.complexValidate] [submitHandler] 表单验证成功~',
                );
            } catch (error) {
                console.log(
                    '[form.complexValidate] [submitHandler] 表单验证失败, error:',
                    error,
                );
            }
        };
        const clearHandler = () => {
            WFormDomRef.value.clearValidate();
        };
        const resetHandler = () => {
            WFormDomRef.value.resetFields();
        };

        return {
            WFormDomRef,
            rePasswordRef,
            modelForm,
            rules,
            scenesDomRef,

            handlePasswordInput,
            validateScenesCont,
            addOptionItem,
            submitHandler,
            clearHandler,
            resetHandler,
        };
    },
};
</script>
<style scoped>
.fes-form {
    width: 600px;
}
.complex-validate-item {
    margin: 10px 0 20px 60px;
    color: rgb(136 136 136);
}
</style>
