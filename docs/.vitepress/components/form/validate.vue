<template>
    <FForm
        ref="WFormDomRef"
        labelWidth="140px"
        labelPosition="right"
        :model="modelForm"
        :rules="rules"
    >
        <FFormItem prop="name">
            <template #label><span>姓名(slot)</span></template>
            <FSpace>
                <FInput
                    v-model="modelForm.name.first"
                    placeholder="请输入first name"
                    @input="changeHandler"
                ></FInput>
                <FInput
                    v-model="modelForm.name.last"
                    placeholder="请输入last name"
                    @input="changeHandler"
                ></FInput>
            </FSpace>
        </FFormItem>
        <FFormItem
            label="年龄"
            prop="age"
            :rules="[{ required: true, type: 'number', message: '请输入年龄' }]"
        >
            <FInputNumber
                v-model="modelForm.age"
                placeholder="请输入年龄"
            ></FInputNumber>
        </FFormItem>
        <FFormItem label="地址单选" prop="sregion">
            <FSelect
                v-model="modelForm.sregion"
                clearable
                placeholder="请单选"
                @change="changeHandler"
            >
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                ></FOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="地址多选" prop="mregion">
            <FSelect
                v-model="modelForm.mregion"
                multiple
                placeholder="请多选"
                @change="changeHandler"
            >
                <FOption
                    v-for="(item, index) in optionList"
                    :key="index"
                    :value="item.value"
                    :label="item.label"
                ></FOption>
            </FSelect>
        </FFormItem>
        <FFormItem label="选择时间" prop="time">
            <FTimePicker
                v-model="modelForm.time"
                placeholder="请输入时间"
                format="HH:mm"
            ></FTimePicker>
        </FFormItem>
        <FFormItem label="选择性别" prop="sex">
            <FRadioGroup v-model="modelForm.sex" @change="changeHandler">
                <FRadio value="1">男</FRadio>
                <FRadio value="2">女</FRadio>
            </FRadioGroup>
        </FFormItem>
        <FFormItem label="级联单选" prop="singleCity">
            <FSelectCascader
                v-model="modelForm.singleCity"
                :data="cascaderOptions"
                @change="changeHandler"
            >
            </FSelectCascader>
        </FFormItem>
        <FFormItem label="级联多选" prop="multiCity">
            <FSelectCascader
                v-model="modelForm.multiCity"
                :data="cascaderOptions"
                :multiple="true"
                @change="changeHandler"
            >
            </FSelectCascader>
        </FFormItem>
        <FFormItem label="备注 slot" labelClass="more-label" prop="desc">
            <template #label>
                <span @click="descClickHandler">
                    <QuestionCircleFilled /> 备注(slot)
                </span>
            </template>
            <FInput
                v-model="modelForm.desc"
                type="textarea"
                placeholder="请输入备注信息，以填入的【姓名】开头"
            ></FInput>
        </FFormItem>
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
// eslint-disable-next-line import/no-unresolved
import { FMessage } from '@fesjs/fes-design';

export default {
    setup() {
        const WFormDomRef = ref(null);
        const modelForm = reactive({
            name: {
                first: '',
                last: '',
            },
            sregion: '',
            mregion: ['HuNan', 'HuBei'],
            time: '',
            sex: '2',
            show: true,
            permission: [],
            desc: '',
            singleCity: '',
            multiCity: [],
        });

        const validateContFun = (rule, value) => {
            return Boolean(value.startsWith(modelForm.name.first));
        };

        const rules = computed(() => {
            return {
                name: {
                    type: 'object',
                    required: true,
                    fields: {
                        first: {
                            type: 'string',
                            required: true,
                            min: 3,
                            max: 8,
                            message: 'first姓名长度在 3 到 8 个字符',
                            trigger: 'change',
                        },
                        last: {
                            type: 'string',
                            required: true,
                            min: 3,
                            max: 8,
                            message: 'last姓名长度在 3 到 8 个字符',
                            trigger: 'change',
                        },
                    },
                },
                sregion: [
                    {
                        required: true,
                        message: '请选择单选',
                        trigger: ['change', 'blur'],
                    },
                ],
                mregion: [
                    {
                        required: true,
                        type: 'array',
                        message: '请选择多选',
                        trigger: ['change', 'blur'],
                    },
                ],
                time: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: ['change', 'blur'],
                    },
                ],
                sex: [
                    {
                        required: true,
                        message: '请选择性别',
                        trigger: 'change',
                    },
                ],
                permission: [
                    {
                        required: true,
                        message: '请选择权限',
                        trigger: 'change',
                        type: 'array',
                    },
                ],
                desc: [
                    {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: ['change'],
                    },
                    {
                        validator: validateContFun,
                        message: '请输入以【姓名】开头的备注信息',
                        trigger: ['change'],
                    },
                ],
                singleCity: [
                    {
                        required: true,
                        message: '请选择单选',
                        trigger: ['change', 'blur'],
                    },
                ],
                multiCity: [
                    {
                        required: true,
                        message: '请选择多选',
                        trigger: ['change', 'blur'],
                        type: 'array',
                    },
                ],
            };
        });

        const optionList = [
            {
                value: 'HuNan',
                label: '湖南',
            },
            {
                value: 'HuBei',
                label: '湖北',
            },
            {
                value: 'ZheJiang',
                label: '浙江',
            },
            {
                value: 'GuangDong',
                label: '广东',
            },
            {
                value: 'JiangSu',
                label: '江苏',
            },
        ];
        const cascaderOptions = [
            {
                value: '110000',
                label: '北京市',
                children: [
                    {
                        value: '110100',
                        label: '市辖区',
                        children: [
                            {
                                value: '110101',
                                label: '东城区东城区东城区东城区东城区东城区',
                            },
                            {
                                value: '110102',
                                label: '西城区',
                            },
                        ],
                    },
                    {
                        value: '110200',
                        label: '市辖县',
                        children: [
                            {
                                value: '110228',
                                label: '密云县',
                            },
                            {
                                value: '110229',
                                label: '延庆县',
                            },
                        ],
                    },
                ],
            },
            {
                value: '130000',
                label: '河北省',
                children: [
                    {
                        value: '130100',
                        label: '石家庄市',
                    },
                    {
                        value: '130200',
                        label: '唐山市',
                    },
                ],
            },
            {
                value: '140000',
                label: '山西省',
            },
        ];

        const changeHandler = (value) => {
            console.log('[form.validate] [changeHandler] value:', value);
        };

        const submitHandler = async () => {
            WFormDomRef.value
                .validate()
                .then(() => {
                    console.log(
                        '[form.validate] [submitHandler] 表单验证成功~',
                    );
                    WFormDomRef.value.resetFields();
                })
                .catch((error) => {
                    console.log(
                        '[form.validate] [submitHandler] 表单验证失败, error:',
                        error,
                    );
                });

            /**
             * // await 调用
             *
             * try {
             *      const result = await WFormDomRef.value.validate();
             *      console.log('[form.validate] [submitHandler] 表单验证成功, result:', result);
             * } catch (error) {
             *      console.log('[form.validate] [submitHandler] 表单验证失败, error:', error);
             * }
             */
        };
        const clearHandler = () => {
            WFormDomRef.value.clearValidate();
        };
        const resetHandler = () => {
            WFormDomRef.value.resetFields();
        };

        const descClickHandler = () => {
            FMessage.success({ content: '你点击了备注<slot/>！' });
        };

        return {
            WFormDomRef,
            modelForm,
            rules,
            optionList,
            changeHandler,
            submitHandler,
            clearHandler,
            resetHandler,
            descClickHandler,
            cascaderOptions,
        };
    },
};
</script>
<style scoped>
.fes-form {
    width: 600px;
}
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
