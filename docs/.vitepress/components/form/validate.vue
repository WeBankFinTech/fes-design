<template>
    <FForm ref="WFormDomRef" labelWidth="140px" labelPosition="right" :model="modelForm" :rules="rules">
        <FFormItem prop="name" :rules="nameRules">
            <template v-slot:label><span>输入姓名(slot)</span></template>
            <FInput v-model="modelForm.name" placeholder="请输入" @input="changeHandler"></FInput>
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
        <FFormItem label="级联单选" prop="singleCity">
            <FCascader       
                v-model="modelForm.singleCity"
                :options="cascaderOptions"
                @change="changeHandler">
            </FCascader>
        </FFormItem>
        <FFormItem label="级联多选" prop="multiCity">
            <FCascader       
                v-model="modelForm.multiCity"
                :options="cascaderOptions"
                :multiple="true"
                @change="changeHandler">
            </FCascader>
        </FFormItem>
        <FFormItem label="操作权限" prop="permission">
            <FCheckboxGroup v-model="modelForm.permission" @change="changeHandler">
                <FCheckbox :value="1">Admin</FCheckbox>
                <FCheckbox :value="2">edit</FCheckbox>
                <FCheckbox :value="3">run</FCheckbox>
                <FCheckbox :value="4">view</FCheckbox>
            </FCheckboxGroup>
        </FFormItem>
        <FFormItem prop="more" labelClass="more-label">
            <template v-slot:label>
                <span @click="moreClickHandler"> 
                    <CheckCircleFilled />补充信息
                </span>
            </template>
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
import { FMessage } from '@fesjs/fes-design';

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
            show: true,
            permission: [],
            more: {
                height: 180,
                weight: 100
            },
            desc: '',

            singleCity: '',
            multiCity: [],
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
                { min: 3, max: 8, message: '姓名长度在 3 到 8 个字符', trigger: 'input' },
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
                {
                    validator: validatePasswordStartWith,
                    message: '再次输入密码时，两次密码输入不一致',
                    trigger: ['input']
                },
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
            permission: [{
                required: true, message: '请选择权限', trigger: 'change', type: 'array'
            }],
            desc: [
                { required: true, message: '请备注内容', trigger: ['blur'] },
                { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: ['input'] },
                { validator: validateContFun, message: '请输入以【姓名】开头的备注信息', trigger: ['input', 'change'] }
            ],
            singleCity: [{ required: true, message: '请选择单选', trigger: 'change' }],
            multiCity: [{ required: true, message: '请选择多选', trigger: 'change', type: 'array' }],
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
        const cascaderOptions = [
        {
            "value": "110000",
            "label": "北京市",
            "children": [
                {
                    "value": "110100",
                    "label": "市辖区",
                    "children": [
                        {
                            "value": "110101",
                            "label": "东城区东城区东城区东城区东城区东城区",
                        },
                        {
                            "value": "110102",
                            "label": "西城区",
                        },
                    ]
                },
                {
                    "value": "110200",
                    "label": "市辖县",
                    "children": [
                        {
                            "value": "110228",
                            "label": "密云县",
                        },
                        {
                            "value": "110229",
                            "label": "延庆县",
                        }
                    ]
                }
            ]
        },
        {
            "value": "130000",
            "label": "河北省",
            "children": [
                {
                    "value": "130100",
                    "label": "石家庄市",
                },
                {
                    "value": "130200",
                    "label": "唐山市",
                },
            ]
        },
        {
            "value": "140000",
            "label": "山西省",
        },
    ]

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
                WFormDomRef.value.resetFields();
            }).catch((error) => {
                console.log('表单验证失败: ', error);
            })

            /** await 调用
             * try {
             *      const result = await WFormDomRef.value.validate();
             *      console.log('表单验证成功: ', result);
             * } catch (error) {
             *      console.log('表单验证失败: ', error);
             * }
             */ 

            /** 验证表单指定字段: validateField() 
             * try {
             *      await WFormDomRef.value.validateField('name');
             * } catch (error) {
             *      console.log('表单项验证失败: ', error);
             * }
             */ 
        }
        const clearHandler = () => {
            WFormDomRef.value.clearValidate();
        }
        const resetHandler = () => {
            WFormDomRef.value.resetFields();
        }

        const moreClickHandler = () => {
            FMessage.success({ content: '支持 labelClass 啦～' });
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
            descClickHandler,
            moreClickHandler,
            cascaderOptions,
        }
    }
}
</script>
<style>
.fes-form .fes-form-item-label.more-label {
   color: #9e9e9e;
}
.row-container {
    width: 100%;
}
.row-item {
    display: flex;
}
</style>