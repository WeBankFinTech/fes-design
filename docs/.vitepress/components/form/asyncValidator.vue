<template>
    <FForm
        ref="formRef"
        labelWidth="140px"
        labelPosition="right"
        :model="modelForm"
        :rules="rules"
    >
        <FFormItem prop="name" label="实时校验">
            <FInput
                v-model="modelForm.name"
                placeholder="请输入姓名"
                :maxlength="30"
                showWordLimit
            ></FInput>
            <LoadingOutlined
                v-show="modelForm.nameLoading"
                style="margin-left: 10px"
            />
        </FFormItem>
        <FFormItem prop="phone" label="防抖校验">
            <FInput
                v-model="modelForm.phone"
                placeholder="请输入手机号"
                :maxlength="11"
                showWordLimit
            ></FInput>
            <LoadingOutlined
                v-show="modelForm.phoneLoading"
                style="margin-left: 10px"
            />
        </FFormItem>
        <FFormItem label=" ">
            <FButton
                type="primary"
                style="margin-right: 20px"
                :loading="modelForm.submitLoading"
                @click="submitHandler"
            >
                {{ modelForm.submitText }}
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
// eslint-disable-next-line import/no-unresolved
import { debounce } from 'lodash-es';
import { FMessage } from '@fesjs/fes-design';

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export default {
    setup() {
        const formRef = ref(null);

        const modelForm = reactive({
            submitLoading: false,
            submitText: '提交',
            name: '',
            nameLoading: false,
            phone: '',
            phoneLoading: false,
        });

        const debounceValidator = debounce(async (value, resolve, reject) => {
            console.log(
                '[form.asyncValidator] [debounceValidator] phone:',
                value,
            );
            modelForm.phoneLoading = true;
            await sleep(2000);
            if (value.length < 11) {
                reject('异步校验手机号不完整');
            } else {
                resolve();
            }
            modelForm.phoneLoading = false;
        }, 300);

        const rules = computed(() => {
            return {
                name: [
                    {
                        required: true,
                        message: '姓名不能为空',
                    },
                    {
                        asyncValidator: (rule, value) => {
                            return new Promise(async (resolve, reject) => {
                                if (!value) {
                                    return reject('异步校验姓名不能为空');
                                }
                                console.log(
                                    '[form.asyncValidator] [asyncValidator] name:',
                                    value,
                                );

                                modelForm.nameLoading = true;
                                await sleep(3000);
                                modelForm.nameLoading = false;

                                if (value.length < 3) {
                                    return reject('异步校验姓名字符个数不足');
                                } else {
                                    return resolve();
                                }
                            });
                        },
                        message: '姓名至少三个字符长度',
                        trigger: ['change'],
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: '手机号不能为空',
                    },
                    {
                        asyncValidator: (rule, value) => {
                            return new Promise(async (resolve, reject) => {
                                if (!value) {
                                    return reject('异步校验手机号不能为空');
                                }
                                debounceValidator(value, resolve, reject);
                            });
                        },
                        message: '手机号不完整',
                        trigger: ['change'],
                    },
                ],
            };
        });

        const submitHandler = async () => {
            try {
                modelForm.submitLoading = true;
                modelForm.submitText = '校验中';
                const result = await formRef.value.validate();
                console.log(
                    '[form.validate] [submitHandler] 表单验证成功, result:',
                    result,
                );
            } catch (error) {
                console.log(
                    '[form.validate] [submitHandler] 表单验证失败, error:',
                    error,
                );
                FMessage.warn('请检查表单项');
            } finally {
                modelForm.submitLoading = false;
                modelForm.submitText = '提交';
            }
        };
        const clearHandler = () => {
            formRef.value.clearValidate();
        };
        const resetHandler = () => {
            formRef.value.resetFields();
        };

        return {
            formRef,
            modelForm,
            rules,
            submitHandler,
            clearHandler,
            resetHandler,
        };
    },
};
</script>
<style scoped></style>
