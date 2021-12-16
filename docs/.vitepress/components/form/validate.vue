<template>
    <FForm ref="WFormDomRef" :labelWidth="140" labelPosition="right" :model="modelForm" :rules="rules">
        <FFormItem prop="name" :rules="nameRules">
            <template v-slot:label><span>输入姓名(slot)</span></template>
            <FInput v-model="modelForm.name" placeholder="请输入" @change="changeHandler"></FInput>
        </FFormItem>
        <FFormItem label="输入密码" prop="password">
            <FInput v-model="modelForm.password" type="password" showPassword placeholder="请输入密码" @input="handlePasswordInput"></FInput>
        </FFormItem>
        <FFormItem label="再次输入" prop="rePassword" ref="rePasswordRef">
            <FInput v-model="modelForm.rePassword" type="password" showPassword placeholder="请再次输入密码" @change="handleRePasswordChange"></FInput>
        </FFormItem>
        <FFormItem label="地址单选" prop="sregion">
            <FSelect v-model="modelForm.sregion" clearable  @change="changeHandler" placeholder="请单选">
                <FOption v-for="(item, index) in optionList" :key="index" :value="item.value" :label="item.label"></FOption>
            </FSelect>
        </FFormItem>
         <FFormItem label="地址多选" prop="mregion">
            <FSelect v-model="modelForm.mregion" multiple @change="changeHandler" placeholder="请多选">
                <FOption v-for="(item, index) in optionList" :key="index" :value="item.value" :label="item.label"></FOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="选择时间" prop="time">
            <FTimePicker v-model="modelForm.time" placeholder="请输入时间" format="HH:mm"></FTimePicker>
        </FFormItem>
        <FFormItem label="选择性别" prop="sex">
            <FRadioGroup v-model="modelForm.sex" @change="changeHandler">
                <FRadio value="1">男</FRadio>
                <FRadio value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="年龄范围" prop="age">
            <FCheckboxGroup v-model="modelForm.age" @change="changeHandler">
                <FCheckbox value="1-10">1-10</FCheckbox>
                <FCheckbox value="11-30">11-30</FCheckbox>
                <FCheckbox value="31-60">31-60</FCheckbox>
            </FCheckboxGroup>
        </FFormItem>
        <FFormItem label="基础信息补充" prop="more">
            <div class="row-container">
                <div class="row-item">
                    <FSelect></FSelect>
                    <FInput></FInput>
                    <PlusCircleOutlined />
                </div>
                <div class="row-item">
                    <FSelect></FSelect>
                    <FInput></FInput>
                    <PlusCircleOutlined />
                </div>
            </div>
        </FFormItem>
        <FFormItem label="备注 slot" prop="desc">
            <template v-slot:label>
                <span @click="descClickHandler"> 
                    <QuestionCircleFilled /> 备注(slot)
                </span>
            </template>
            <FInput v-model="modelForm.desc" type="textarea" placeholder="请输入备注信息，以填入的【姓名】开头"></FInput>
        </FFormItem>
        <FFormItem>
            <FButton type="primary" @click="submitHandler" style="margin-right: 20px">提交</FButton>
            <FButton type="primary" @click="clearHandler" style="margin-right: 20px">清除</FButton>
            <FButton type="primary" @click="resetHandler">重置</FButton>
        </FFormItem>
    </FForm>
</template>

<script>
import { ref, reactive } from 'vue';
import { FMessage } from 'fes-design';

export default {
    setup(){
        const WFormDomRef = ref(null);
        const rePasswordRef = ref(null)
        const modelForm = reactive({
            name: '',
            password: '',
            rePassword: '',
            sregion: '',
            mregion: ['HuNan', 'HuBei'],
            time: '',
            sex: '2',
            age: ['1-10'],
            more: {
                height: 180,
                weight: 100
            },
            desc: ''
        });
        const validateContFun = (rule, value) => {
            return Boolean(value.startsWith(modelForm.name));
        }
        const validatePasswordStartWith = (rule, value) => {
            return Boolean(
                modelForm.password &&
                modelForm.password.startsWith(value) &&
                modelForm.password.length >= value.length
            )
        }
        const validatePasswordSame = (rule, value) => {
            return value === modelForm.password
        }

        const rules = {
            name: [
                { min: 3, max: 8, message: '姓名长度在 3 到 8 个字符', trigger: ['input'] },
            ],
            password: [
                { required: true, message: '请输入密码', trigger: ['blur', 'input'] }
            ],
            rePassword: [
                {
                    required: true,
                    message: '请再次输入密码',
                    trigger: ['input', 'blur']
                },
                // {
                //     validator: validatePasswordStartWith,
                //     message: '再次输入密码时，两次密码输入不一致',
                //     trigger: ['input']
                // },
                {
                    validator: validatePasswordSame,
                    message: '输入密码时，两次密码输入不一致',
                    trigger: 'password-input'
                }
            ],
            sregion: [{ required: true, message: '请选择单选', trigger: 'change' }],
            time: [{ required: true, message: '请选择时间', trigger: 'change' }],
            sex: [{
                required: true, message: '请选择性别', trigger: 'change'
            }],
            age: [{
                required: true, message: '请选择年龄范围', trigger: 'change', type: 'array'
            }],
            desc: [
                { required: true, message: '请备注内容', trigger: ['blur'] },
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: ['input'] },
                { validator: validateContFun, message: '请输入以【姓名】开头的备注信息', trigger: ['input', 'change'] }
            ]
        };
        const nameRules = [{ required: true, message: '请输入姓名', trigger: 'blur' }];
        const optionList = [{
            value: 'HuNan',
            label: '湖南'
        },{
            value: 'HuBei',
            label: '湖北',
        },{
            value: 'ZheJiang',
            label: '浙江'
        },{
            value: 'GuangDong',
            label: '广东'
        },{
            value: 'JiangSu',
            label: '江苏'
        }];

        const changeHandler = (value) => {
            console.log('value', value);
        }

        const handlePasswordInput = () => {
            if (modelForm.rePassword) {
                rePasswordRef.value.validate('password-input')
            }
        }
        
        const handleRePasswordChange = (value) => {
            rePasswordRef.value.validate('input')
        }

        const submitHandler = async () => {
            
            WFormDomRef.value.validate().then((result) => {
                console.log('表单验证成功: ', result);
            }).catch((error) => {
                console.log('表单验证失败: ', error);
            })

            // try {
            //     const result = await WFormDomRef.value.validate();
            //     console.log('表单验证成功: ', result);
            // } catch (error) {
            //     console.log('表单验证失败: ', error);
            // }
            
            // 验证表单指定字段: validateField() 
            // try {
            //     await WFormDomRef.value.validateField('name');
            // } catch (error) {
            //     console.log('表单验证失败: ', error);
            // }
        }
        const clearHandler = () => {
            WFormDomRef.value.clearValidate();
        }
        const resetHandler = () => {
            WFormDomRef.value.resetFields();
        }

        const descClickHandler = () => {
            FMessage.success({ content: '你点击了备注<slot/>！' });
        }
        
        return {
            WFormDomRef,
            rePasswordRef,
            modelForm,
            rules,
            nameRules,
            optionList,
            changeHandler,
            handlePasswordInput,
            handleRePasswordChange,
            submitHandler,
            clearHandler,
            resetHandler,
            descClickHandler
        }
    }
}
</script>
<style scoped>
.row-container {
    width: 100%;
}
.row-item {
    display: flex;
}
</style>