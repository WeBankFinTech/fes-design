<template>
    <FForm
        ref="formRef"
        labelWidth="140px"
        labelPosition="right"
        :model="modelForm"
        :rules="rules"
    >
        <FFormItem
            prop="name"
            label="表单项嵌套:"
            :showMessage="false"
            style="margin-bottom: 0"
        >
            <FSpace>
                <FFormItem prop="name.first" :rules="rules.name.fields.first">
                    <FInput
                        v-model="modelForm.name.first"
                        placeholder="请输入FirstName"
                    />
                </FFormItem>
                <FFormItem prop="name.last" :rules="rules.name.fields.last">
                    <FInput
                        v-model="modelForm.name.last"
                        placeholder="请输入LastName"
                    />
                </FFormItem>
            </FSpace>
        </FFormItem>
        <FFormItem prop="userList" label="子表单嵌套:">
            <FSpace vertical style="width: 100%">
                <FButton @click="() => handleAddUser()"> 添加 </FButton>

                <FCard v-for="(item, index) in modelForm.userList" :key="index">
                    <FForm
                        :ref="(el) => (userFormItemRefList[index] = el)"
                        :model="item"
                        :rules="subFormRules"
                    >
                        <FFormItem prop="name" label="姓名:">
                            <FSpace>
                                <FInput
                                    v-model="item.name.first"
                                    placeholder="请输入FirstName"
                                />
                                <FInput
                                    v-model="item.name.last"
                                    placeholder="请输入LastName"
                                />
                            </FSpace>
                        </FFormItem>
                        <FFormItem prop="desc" label="备注:">
                            <FInput
                                v-model="item.desc"
                                placeholder="请输入备注"
                            />
                        </FFormItem>
                    </FForm>
                </FCard>
            </FSpace>
        </FFormItem>

        <FFormItem label=" ">
            <FSpace>
                <FButton type="primary" @click="submitHandler"> 提交 </FButton>
                <FButton type="primary" @click="clearHandler"> 清除 </FButton>
                <FButton type="primary" @click="resetHandler">重置</FButton>
            </FSpace>
        </FFormItem>
    </FForm>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        const formRef = ref(null);
        const userFormItemRefList = ref([]);

        const modelForm = reactive({
            name: {
                first: '',
                last: '',
            },
            userList: [],
        });

        const rules = computed(() => {
            return {
                name: {
                    type: 'object',
                    required: true,
                    fields: {
                        first: [
                            {
                                type: 'string',
                                required: true,
                                min: 3,
                                max: 8,
                                message: 'first姓名长度在 3 到 8 个字符',
                                trigger: 'change',
                            },
                        ],
                        last: [
                            {
                                type: 'string',
                                required: true,
                                min: 3,
                                max: 8,
                                message: 'last姓名长度在 3 到 8 个字符',
                                trigger: 'change',
                            },
                        ],
                    },
                },
                userList: {
                    type: 'array',
                    required: true,
                    message: '用户列表不能为空',
                    trigger: 'change',
                },
            };
        });

        const subFormRules = computed(() => {
            return {
                name: {
                    type: 'object',
                    required: true,
                    fields: {
                        first: [
                            {
                                type: 'string',
                                required: true,
                                min: 3,
                                max: 8,
                                message: 'first姓名长度在 3 到 8 个字符',
                                trigger: 'change',
                            },
                        ],
                        last: [
                            {
                                type: 'string',
                                required: true,
                                min: 3,
                                max: 8,
                                message: 'last姓名长度在 3 到 8 个字符',
                                trigger: 'change',
                            },
                        ],
                    },
                },
            };
        });

        const handleAddUser = async () => {
            modelForm.userList.push({
                name: {
                    first: '',
                    last: '',
                },
                desc: '',
            });
            // 触发单个表单项的校验
            await formRef.value.validate(['userList']);
        };

        const submitHandler = async () => {
            try {
                await formRef.value.validate();

                for (const userFormItemRef of userFormItemRefList.value) {
                    await userFormItemRef?.validate();
                }

                console.log(
                    '[form.subFormValidator] [submitHandler] 表单验证成功 || modelForm:',
                    modelForm,
                );
            } catch (error) {
                console.log(
                    '[form.subFormValidator] [submitHandler] 表单验证失败, error:',
                    error,
                );
                FMessage.warn('请检查表单项');
            }
        };
        const clearHandler = async () => {
            formRef.value.clearValidate();
            for (const userFormItemRef of userFormItemRefList.value) {
                await userFormItemRef?.clearValidate();
            }
        };
        const resetHandler = async () => {
            formRef.value.resetFields();
            for (const userFormItemRef of userFormItemRefList.value) {
                await userFormItemRef?.resetFields();
            }
        };

        return {
            formRef,
            userFormItemRefList,
            modelForm,
            rules,
            submitHandler,
            clearHandler,
            resetHandler,
            subFormRules,
            handleAddUser,
        };
    },
};
</script>

<style scoped></style>
