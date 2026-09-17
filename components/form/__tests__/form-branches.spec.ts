import { mount } from '@vue/test-utils';
import { h, nextTick, reactive } from 'vue';
import Form from '../form.vue';
import FormItem from '../formItem.vue';
import { FInput } from '../../input';
import { FORM_LAYOUT } from '../const';

const prefixCls = 'fes-form';
const MODEL_REQUIRED_MSG = 'Form `model` is required for resetFields to work.';
const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));

// 挂载 Form + 单个 FormItem（默认插槽为原生 input）
const mountSingle = (
    model: Record<string, unknown>,
    rules: Record<string, unknown>,
    itemProps: Record<string, unknown> = {},
    itemSlots: () => any = () => h('input'),
) =>
    mount(Form, {
        props: { model, rules },
        slots: {
            default: () =>
                h(
                    FormItem,
                    { prop: 'name', label: '姓名', ...itemProps } as any,
                    { default: itemSlots },
                ),
        },
    });

// 挂载 Form + 多个 FormItem（prop 显式指定）
const mountFields = (
    model: Record<string, unknown>,
    rules: Record<string, unknown>,
    items: { prop: string; label: string; props?: Record<string, unknown> }[],
) =>
    mount(Form, {
        props: { model, rules },
        slots: {
            default: () =>
                items.map((item) =>
                    h(
                        FormItem,
                        { prop: item.prop, label: item.label, ...item.props } as any,
                        { default: () => h('input') },
                    ),
                ),
        },
    });

// 挂载 Form + FormItem + 真实 FInput（form 校验的真实交互链）
const mountWithInput = (
    model: { name: string },
    rules: Record<string, unknown>,
    formProps: Record<string, unknown> = {},
    itemProps: Record<string, unknown> = {},
) =>
    mount(Form, {
        props: { model, rules, ...formProps },
        slots: {
            default: () =>
                h(
                    FormItem,
                    { prop: 'name', label: '姓名', ...itemProps } as any,
                    {
                        default: () =>
                            h(FInput, {
                                'modelValue': model.name,
                                'onUpdate:modelValue': (v: string) => {
                                    model.name = v;
                                },
                            }),
                    },
                ),
        },
    });

describe('FForm 分支补全', () => {
    test('inline 布局 + inlineItemWidth 生成列宽与间距样式', () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: {
                model,
                layout: FORM_LAYOUT.INLINE,
                inlineItemWidth: 200,
                inlineItemGap: 20,
            },
            slots: {
                default: () => [
                    h(
                        FormItem,
                        { prop: 'name', label: '姓名' } as any,
                        { default: () => h('input') },
                    ),
                ],
            },
        });
        const style = wrapper.attributes('style') || '';
        // tempColStyle 分支：inline + inlineItemWidth 同时满足
        expect(style).toContain('grid-template-columns');
        expect(style).toContain('repeat(auto-fit, 200px)');
        // gapStyle 分支：inline + inlineItemGap 同时满足
        expect(style).toContain('grid-gap');
        expect(style).toContain('20px');
        wrapper.unmount();
    });

    test('无 model 时 validate 拒绝并给出提示', async () => {
        const wrapper = mount(Form, {
            slots: {
                default: () =>
                    h(FormItem, { prop: 'name' } as any, {
                        default: () => h('input'),
                    }),
            },
        } as any);
        await nextTick();
        const vm: any = wrapper.vm;
        await expect(vm.validate()).rejects.toBe(MODEL_REQUIRED_MSG);
        wrapper.unmount();
    });

    test('无 model 时 clearValidate 拒绝并给出提示', async () => {
        const wrapper = mount(Form, {
            slots: {
                default: () =>
                    h(FormItem, { prop: 'name' } as any, {
                        default: () => h('input'),
                    }),
            },
        } as any);
        await nextTick();
        const vm: any = wrapper.vm;
        await expect(vm.clearValidate()).rejects.toBe(MODEL_REQUIRED_MSG);
        wrapper.unmount();
    });

    test('validate 指定 prop 白名单仅校验匹配字段', async () => {
        const model = reactive({ name: '', age: '' });
        const rules = {
            name: [{ required: true, message: '请填姓名' }],
            age: [{ required: true, message: '请填年龄' }],
        };
        const wrapper = mountFields(model, rules, [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        const vm: any = wrapper.vm;
        let res: any;
        // 只校验 name：age 同样必填失败但不应出现在结果中
        await vm.validate(['name']).catch((e: unknown) => {
            res = e;
        });
        expect(res.valid).toBe(false);
        expect(res.values).toEqual(['name']);
        expect(res.errorFields).toHaveLength(1);
        // 只校验 age：name 被跳过
        await vm.validate(['age']).catch((e: unknown) => {
            res = e;
        });
        expect(res.values).toEqual(['age']);
        // 不指定 fieldProps：全部校验
        await vm.validate().catch((e: unknown) => {
            res = e;
        });
        expect(res.values).toEqual(['name', 'age']);
        wrapper.unmount();
    });

    test('validate 指定未注册的 prop 时跳过全部字段并 resolve', async () => {
        const model = reactive({ name: '', age: '' });
        const rules = {
            name: [{ required: true, message: '请填姓名' }],
            age: [{ required: true, message: '请填年龄' }],
        };
        const wrapper = mountFields(model, rules, [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        const vm: any = wrapper.vm;
        // specifyPropsFlag 为真且不包含任何字段 → 全部跳过 → promiseList 为空
        await expect(vm.validate(['not-exist'])).resolves.toEqual([]);
        wrapper.unmount();
    });

    test('clearValidate 指定 prop 仅清除匹配字段的错误', async () => {
        const model = reactive({ name: '', age: '' });
        const rules = {
            name: [{ required: true, message: '请填姓名' }],
            age: [{ required: true, message: '请填年龄' }],
        };
        const wrapper = mountFields(model, rules, [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        const vm: any = wrapper.vm;
        await vm.validate().catch(() => {});
        await nextTick();
        expect(wrapper.text()).toContain('请填姓名');
        expect(wrapper.text()).toContain('请填年龄');
        // 命中字段被清除
        vm.clearValidate(['name']);
        await nextTick();
        expect(wrapper.text()).not.toContain('请填姓名');
        expect(wrapper.text()).toContain('请填年龄');
        // 未命中的字段调用 → skip 分支，错误保持
        vm.clearValidate(['not-exist']);
        await nextTick();
        expect(wrapper.text()).toContain('请填年龄');
        wrapper.unmount();
    });

    test('resetFields 指定 prop 仅重置匹配字段值', async () => {
        const model = reactive({ name: '初始姓名', age: '初始年龄' });
        const rules = {};
        const wrapper = mountFields(model, rules, [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        const vm: any = wrapper.vm;
        model.name = '改名';
        model.age = '改龄';
        await vm.resetFields(['name']);
        // name 回滚到挂载时的初始值，age 保持修改后的值
        expect(model.name).toBe('初始姓名');
        expect(model.age).toBe('改龄');
        wrapper.unmount();
    });

    test('submit 事件被拦截并携带事件对象 emit', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: { model },
            slots: {
                default: () =>
                    h(FormItem, { prop: 'name' } as any, {
                        default: () => h('input'),
                    }),
            },
        });
        const formEl = wrapper.find('form').element;
        const evt = new Event('submit', { bubbles: true, cancelable: true });
        formEl.dispatchEvent(evt);
        // handleSubmit 阻止了原生提交
        expect(evt.defaultPrevented).toBe(true);
        const emitted = wrapper.emitted('submit');
        expect(emitted).toBeTruthy();
        expect(emitted![0][0]).toBe(evt);
        wrapper.unmount();
    });

    test('部分字段通过时 errorFields 仅含失败字段', async () => {
        const model = reactive({ name: '', age: '18' });
        const rules = {
            name: [{ required: true, message: '请填姓名' }],
            age: [{ required: true, message: '请填年龄' }],
        };
        const wrapper = mountFields(model, rules, [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
        ]);
        await nextTick();
        const vm: any = wrapper.vm;
        let res: any;
        await vm.validate().catch((e: unknown) => {
            res = e;
        });
        // age 通过 → errors 为空数组 → 不进入 errorList（errors?.length 假分支）
        expect(res.valid).toBe(false);
        expect(res.values).toEqual(['name']);
        expect(res.errorFields).toHaveLength(1);
        expect(res.errorFields[0].name).toBe('name');
        wrapper.unmount();
    });

    // 不可达分支说明：
    // - form.vue `if (formItemProp)` 的假分支不可达：formItemProp = props.prop || 生成的
    //   uid 兜底串，计算属性恒为真值，addField 永远注册字段。
});

describe('FFormItem 分支补全', () => {
    test('FormItem value 显式传入时以 value 优先参与校验', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules, { value: '显式值' });
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        // model 为空但 value 非空 → 必填通过
        await vm.validate();
        await nextTick();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        // 确认显式传入的 value 确实生效于字段值
        expect(wrapper.findComponent(FormItem).props('value')).toBe('显式值');
        expect(model.name).toBe('');
        wrapper.unmount();
    });

    test('FormItem rules 传 null 时回退空数组并合并表单规则', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules, { rules: null as any });
        await nextTick();
        // props.rules 为 null → `|| []` 兜底，合并表单 rules 后 required 生效
        const label = wrapper.find('.fes-form-item-label');
        expect(label.classes()).toContain('is-required');
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        expect(wrapper.text()).toContain('必填');
        wrapper.unmount();
    });

    test('FormItem showMessage=false 覆盖表单设置隐藏错误', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules, { showMessage: false });
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        // props.showMessage 非 null → 三元表达式走 false 分支 → 错误被抑制
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('必填');
        wrapper.unmount();
    });

    test('FormItem showMessage=true 显式展示校验错误', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules, { showMessage: true });
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        const errEl = wrapper.find('.fes-form-item-error');
        expect(errEl.exists()).toBe(true);
        expect(errEl.text()).toBe('必填');
        expect(wrapper.find('.fes-form-item').classes()).toContain('is-error');
        wrapper.unmount();
    });

    test('FormItem disabled=true 显式禁用内部控件', async () => {
        const model = reactive({ name: '' });
        const wrapper = mountWithInput(model, {}, {}, { disabled: true });
        await nextTick();
        // isNil(props.disabled) 为假 → 取 item 自身的 disabled
        expect(wrapper.find('input[disabled]').exists()).toBe(true);
        // 表单级未禁用 → form 根上没有 disabled 类
        const formCls = wrapper.find(`.${prefixCls}`).classes();
        expect(formCls.some((c) => c.includes('disabled'))).toBe(false);
        wrapper.unmount();
    });

    test('FormItem disabled=false 覆盖表单级禁用', async () => {
        const model = reactive({ name: '' });
        const wrapper = mountWithInput(model, {}, { disabled: true }, { disabled: false });
        await nextTick();
        // item 显式 disabled=false 优先级最高 → 控件可用
        expect(wrapper.find('input[disabled]').exists()).toBe(false);
        // 表单自身仍是禁用态（类名保留）
        const formCls = wrapper.find(`.${prefixCls}`).classes();
        expect(formCls.some((c) => c.includes('disabled'))).toBe(true);
        wrapper.unmount();
    });

    test('resetFields 进行中的校验被 validateDisabled 抑制', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        // 先启动校验（内部 await nextTick 挂起），再同步重置 → validateDisabled 拦截
        const pending = vm.validate();
        vm.resetFields();
        // validateDisabled 拦截 → 不 reject，返回空错误结果
        await expect(pending).resolves.toEqual([{ name: 'name', errors: [] }]);
        await nextTick();
        // 校验被跳过 → 不产生错误文案
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('blur 触发必填校验（trigger 字符串匹配 + 不匹配跳过）', async () => {
        const model = reactive({ name: '' });
        const rules = {
            name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        };
        const wrapper = mountWithInput(model, rules);
        await nextTick();
        const input = wrapper.find('input');
        // blur → trigger 'blur' === 'blur' → 规则参与校验 → 空值失败
        await input.trigger('blur');
        await wait();
        const errEl = wrapper.find('.fes-form-item-error');
        expect(errEl.exists()).toBe(true);
        expect(errEl.text()).toBe('请输入姓名');
        // 输入事件 validate('input') → trigger 不匹配 → activeRules 为空 → 校验跳过，
        // 错误状态保持不变
        await input.setValue('张三');
        await input.trigger('input');
        await wait();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('请输入姓名');
        // 再次 blur 重新校验 → 通过 → 错误清除
        await input.trigger('blur');
        await wait();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('trigger 数组含 change 时输入即时校验', async () => {
        const model = reactive({ name: '' });
        const rules = {
            name: [
                { required: true, message: '必填', trigger: ['blur', 'change'] },
            ],
        };
        const wrapper = mountWithInput(model, rules);
        await nextTick();
        const input = wrapper.find('input');
        // 输入事件：validate('input') → includes('input') 为假被排除；
        // validate('change') → includes('change') 为真 → 空值即时失败
        await input.trigger('input');
        await wait();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('必填');
        // 填入合法值后 change 校验通过 → 错误清除
        await input.setValue('张三');
        await input.trigger('input');
        await wait();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('无 trigger 的规则在非空 trigger 校验时仍生效', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountWithInput(model, rules);
        await nextTick();
        // rule.trigger 为空 → `!rule.trigger` 为真 → 不按 trigger 过滤直接参与
        await wrapper.find('input').trigger('blur');
        await wait();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('必填');
        wrapper.unmount();
    });

    test('asyncValidator 异步校验失败与恢复', async () => {
        const model = reactive({ name: '' });
        const asyncValidator = vi.fn((_rule: unknown, value: string) =>
            value ? Promise.resolve() : Promise.reject(new Error('接口校验失败')),
        );
        const rules = { name: [{ asyncValidator }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        // asyncValidator 分支：wrapValidator(async=true) 包装并透传 promise
        expect(asyncValidator).toHaveBeenCalled();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('接口校验失败');
        // 值合法后再次校验 → 通过
        model.name = 'ok';
        await nextTick();
        await vm.validate();
        await nextTick();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('自定义 validator 返回布尔参与校验并携带校验值', async () => {
        const model = reactive({ name: '' });
        const validator = vi.fn((_rule: unknown, value: string) => value === 'ok');
        const rules = { name: [{ validator, message: '自定义校验失败' }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        expect(validator).toHaveBeenCalled();
        expect(validator.mock.calls[0][1]).toBe('');
        expect(wrapper.find('.fes-form-item-error').text()).toBe('自定义校验失败');
        model.name = 'ok';
        await nextTick();
        await vm.validate();
        await nextTick();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('回调风格自定义 validator 的错误文案取自 rule.message（锁定现状）', async () => {
        const model = reactive({ name: '' });
        const validator = vi.fn((_rule: unknown, _value: unknown, callback: any) => {
            callback(new Error('内部错误'));
        });
        const rules = { name: [{ validator, message: '自定义提示' }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        // wrapValidator 将 undefined 返回值规范化为 true，async-validator 双回调
        // 下错误文案取 rule.message —— 锁定当前行为，勿按 cb 的错误对象断言
        expect(validator).toHaveBeenCalled();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('自定义提示');
        wrapper.unmount();
    });

    test('规则显式 type 时按类型校验（跳过默认 string 推断）', async () => {
        const model = reactive({ name: 'abc' });
        const rules = { name: [{ type: 'number' }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        const vm: any = wrapper.findComponent(Form).vm;
        await vm.validate().catch(() => {});
        await nextTick();
        // !rule.type 为假 → 不做默认 string 推断 → number 类型检查报错（默认类型文案）
        expect(wrapper.find('.fes-form-item-error').text()).toContain('is not a number');
        expect(wrapper.find('.fes-form-item').classes()).toContain('is-error');
        // 值变为合法数字 → number 校验通过 → 错误清除
        (model as any).name = 123;
        await nextTick();
        await vm.validate();
        await nextTick();
        expect(wrapper.find('.fes-form-item-error').exists()).toBe(false);
        wrapper.unmount();
    });

    test('FormItem validate 不传 trigger 时校验全部规则', async () => {
        const model = reactive({ name: '' });
        const rules = { name: [{ required: true, message: '必填' }] };
        const wrapper = mountSingle(model, rules);
        await nextTick();
        // validate(trigger = TRIGGER_TYPE_DEFAULT) 默认参数分支
        const itemVm: any = wrapper.findComponent(FormItem).vm;
        await itemVm.validate();
        await nextTick();
        expect(wrapper.find('.fes-form-item-error').text()).toBe('必填');
        expect(wrapper.find('.fes-form-item').classes()).toContain('is-error');
        wrapper.unmount();
    });

    // 不可达分支说明：
    // - formItem.vue `catch (errObj)` 中 `if (errObj.errors)` 的假分支：async-validator
    //   校验失败时总是 reject AsyncValidationError（自带 .errors），防御分支不可达。
    // - formItem.vue 错误对象里 `descriptor: descriptor[formItemProp.value] || null` 的
    //   假分支：descriptor 上一行刚被赋值，恒为真值，null 兜底不可达。
});
