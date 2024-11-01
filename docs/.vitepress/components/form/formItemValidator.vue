<template>
    <FForm
        ref="formRef"
        labelWidth="140px"
        labelPosition="right"
        :model="modelForm"
        :showMessage="true"
        :rules="rules"
    >
        <FFormItem prop="name" label="姓名">
            <FInput
                v-model="modelForm.name"
                placeholder="请输入姓名"
            />
        </FFormItem>
        <FFormItem
            label="备注 slot"
            labelClass="more-label-container"
            prop="desc"
            :value="modelForm.desc"
        >
            <template #label>
                <span class="more-label-text" @click="descClickHandler">
                    <QuestionCircleFilled /> 备注(slot)
                </span>
            </template>
            <FInput
                v-model="modelForm.desc"
                type="textarea"
                placeholder="请输入备注信息"
                @input="changeHandler"
                @change="changeHandler"
            />
        </FFormItem>
        <FFormItem label=" ">
            <FSpace>
                <FButton type="primary" @click="submitHandler"> 提交 </FButton>
                <FButton type="primary" @click="clearHandler"> 清除 </FButton>
                <FButton type="primary" @click="resetHandler">重置</FButton>
                <FButton type="primary" @click="clearNameHandler"> 清除姓名 </FButton>
                <FButton type="primary" @click="resetNameHandler">重置姓名</FButton>
            </FSpace>
        </FFormItem>
    </FForm>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { FMessage } from '@fesjs/fes-design';

const formRef = ref(null);

const modelForm = reactive({
    name: '',
    desc: '',
});

const validateContFun = (rule, value) => {
    console.log('[form.validate] [validateContFun] value:', value);
    return Boolean(value.length >= 3 && value.length <= 8);
};
const rules = computed(() => {
    return {
        name: [{
            required: true,
            message: '请输入姓名',
            trigger: ['change'],
        }],
        desc: [
            {
                required: true,
                message: '请输入备注',
                trigger: ['change'],
            },
            {
                validator: validateContFun,
                message: '长度在 3 到 8 个字符',
                trigger: ['change'],
            },
        ],
    };
});

const changeHandler = (value) => {
    console.log('[form.validate] [changeHandler] value:', value);
};

const submitHandler = async () => {
    try {
        await formRef.value.validate();
        console.log('[form.validate] [submitHandler] 表单验证成功~');
    } catch (error) {
        console.log(
            '[form.validate] [submitHandler] 表单验证失败, error:',
            error,
        );
        FMessage.warn('请检查表单项');
    }
};
const clearHandler = () => {
    formRef.value.clearValidate();
};
const resetHandler = () => {
    formRef.value.resetFields();
};

const clearNameHandler = () => {
    formRef.value.clearValidate(['name']);
};
const resetNameHandler = () => {
    formRef.value.resetFields(['name']);
};
</script>

<style scoped>
.more-label-text {
    color: #9e9e9e;
    display: flex;
    align-items: center;
}
.more-label-text > :first-child {
    margin-right: 5px;
}
</style>
