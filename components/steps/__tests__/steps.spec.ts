import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Steps from '../steps';
import Step from '../step';
import { STATUS } from '../const';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('steps');
const stepPrefixCls = getPrefixCls('step');

const mountSteps = (stepsProps = {}, steps: Step[] = []) => mount(Steps, {
    props: stepsProps,
    slots: {
        default: () => steps.map((step) => h(Step, step)),
    },
});

describe('Steps', () => {
    test('current 当前步：之前的为 finish、当前为 process、之后的为 wait', async () => {
        const wrapper = mountSteps(
            { current: 2 },
            [{ title: '步骤一' }, { title: '步骤二' }, { title: '步骤三' }],
        );
        // onMounted 中 count 累加触发 index 重新计算，需要等一个 tick
        await nextTick();

        // 根节点类名
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.classes()).toContain('is-default');
        expect(wrapper.classes()).not.toContain('is-vertical');

        const items = wrapper.findAll(`.${stepPrefixCls}`);
        expect(items.length).toBe(3);
        expect(items[0].classes()).toContain(`is-${STATUS.FINISH}`);
        expect(items[1].classes()).toContain(`is-${STATUS.PROCESS}`);
        expect(items[2].classes()).toContain(`is-${STATUS.WAIT}`);

        // wait/process 显示序号，finish 显示对勾图标
        const symbols = wrapper.findAll(`.${stepPrefixCls}-symbol-wrapper`);
        expect(symbols[0].find('svg').exists()).toBe(true);
        expect(symbols[1].text()).toBe('2');
        expect(symbols[2].text()).toBe('3');

        // 步骤序号从 initial（默认 1）开始
        expect(items[0].text()).toContain('步骤一');
    });

    test('status error：通过 steps 的 status 或 step 的 status 指定错误状态', async () => {
        // steps 上指定 status，作用在当前步（index 与 current 相同的步）上
        const wrapper = mountSteps(
            { current: 2, status: STATUS.ERROR },
            [{ title: '步骤一' }, { title: '步骤二' }],
        );
        await nextTick();
        let items = wrapper.findAll(`.${stepPrefixCls}`);
        expect(items[0].classes()).toContain(`is-${STATUS.FINISH}`);
        expect(items[1].classes()).toContain(`is-${STATUS.ERROR}`);
        // error 状态展示关闭图标
        expect(items[1].find(`.${stepPrefixCls}-symbol-wrapper svg`).exists()).toBe(true);

        // step 上单独指定 status 优先级更高（current=3 时两步本应都是 finish）
        const wrapper2 = mountSteps(
            { current: 3 },
            [{ title: '步骤一' }, { title: '步骤二', status: STATUS.ERROR }],
        );
        await nextTick();
        items = wrapper2.findAll(`.${stepPrefixCls}`);
        expect(items[0].classes()).toContain(`is-${STATUS.FINISH}`);
        expect(items[1].classes()).toContain(`is-${STATUS.ERROR}`);
    });

    test('vertical 垂直模式', async () => {
        const wrapper = mountSteps(
            { current: 1, vertical: true },
            [{ title: '步骤一' }, { title: '步骤二' }, { title: '步骤三' }],
        );
        await nextTick();

        expect(wrapper.classes()).toContain('is-vertical');
        // 垂直模式下连接线在 symbol 内，每个 step 一条
        expect(wrapper.findAll(`.${stepPrefixCls}-tail`).length).toBe(3);
        expect(
            wrapper.find(`.${stepPrefixCls}-symbol .${stepPrefixCls}-tail`).exists(),
        ).toBe(true);

        // 非垂直模式下连接线在 title 内，symbol 内没有
        const wrapper2 = mountSteps(
            { current: 1 },
            [{ title: '步骤一' }, { title: '步骤二' }],
        );
        await nextTick();
        expect(
            wrapper2.find(`.${stepPrefixCls}-symbol .${stepPrefixCls}-tail`).exists(),
        ).toBe(false);
        expect(wrapper2.findAll(`.${stepPrefixCls}-tail`).length).toBe(2);
    });

    test('点击 step 触发 clickStep 事件（symbol 与 title 均可点击）', async () => {
        const onClickStep = vi.fn();
        const wrapper = mount(Steps, {
            props: {
                current: 1,
            },
            slots: {
                default: () => [
                    h(Step, { title: '步骤一', onClickStep }),
                    h(Step, { title: '步骤二', onClickStep }),
                ],
            },
        });
        await nextTick();

        const items = wrapper.findAll(`.${stepPrefixCls}`);
        // 点击 symbol
        await items[0].find(`.${stepPrefixCls}-symbol-wrapper`).trigger('click');
        expect(onClickStep).toHaveBeenCalledTimes(1);
        expect(onClickStep).toHaveBeenCalledWith(1);

        // 点击 title 文本
        await items[1].find(`.${stepPrefixCls}-text`).trigger('click');
        expect(onClickStep).toHaveBeenCalledTimes(2);
        expect(onClickStep).toHaveBeenLastCalledWith(2);
    });

    test('description 与 title 支持插槽渲染', async () => {
        const wrapper = mount(Steps, {
            props: {
                current: 1,
            },
            slots: {
                default: () => h(Step, { title: '步骤一' }, {
                    title: () => '插槽标题',
                    description: () => '插槽描述',
                }),
            },
        });
        await nextTick();

        const item = wrapper.find(`.${stepPrefixCls}`);
        expect(item.find(`.${stepPrefixCls}-title`).text()).toBe('插槽标题');
        expect(item.find(`.${stepPrefixCls}-description`).text()).toBe('插槽描述');
    });
});
