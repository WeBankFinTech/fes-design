import { mount } from '@vue/test-utils';
import FProgress from '../progress';
import { PROGRESS_TYPE, prefixCls } from '../const';
import { getLineProgressBarStyle, getProgressDimension } from '../helper';

describe('FProgress', () => {
    test('line 类型为默认类型', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 20,
            },
        });

        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.find('.line-progress-container').exists()).toBe(true);
        expect(wrapper.find('svg.circle-progress').exists()).toBe(false);
    });

    test('line 类型按 percent 渲染宽度', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 40,
            },
        });

        const style = wrapper.find('.progress-item').attributes('style');
        expect(style).toContain('width: 40%');
        expect(style).toContain('height: 8px');
        expect(style).toContain('border-radius: 4px');
    });

    test('percent 超过 100 时被收敛为 100', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });
        const wrapper = mount(FProgress, {
            props: {
                percent: 150,
            },
        });

        expect(wrapper.find('.progress-item').attributes('style')).toContain(
            'width: 100%',
        );
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    test('percent 小于 0 时被收敛为 0', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });
        const wrapper = mount(FProgress, {
            props: {
                percent: -20,
            },
        });

        expect(wrapper.find('.progress-item').attributes('style')).toContain(
            'width: 0%',
        );
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    test('line 类型 color 设置进度条颜色', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 30,
                color: '#ff6200',
            },
        });

        expect(wrapper.find('.progress-item').attributes('style')).toContain(
            'background: rgb(255, 98, 0)',
        );
    });

    test('showOutPercent 外显百分比', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 30,
                showOutPercent: true,
            },
        });

        expect(wrapper.find('.out-value').text()).toBe('30%');
    });

    test('默认不外显百分比', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 30,
            },
        });

        expect(wrapper.find('.out-value').exists()).toBe(false);
    });

    test('showInnerPercent 需要高度大于等于 12px 才内显', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 30,
                showInnerPercent: true,
                height: 8,
            },
        });
        expect(wrapper.find('.inner-value').exists()).toBe(false);

        const tallWrapper = mount(FProgress, {
            props: {
                percent: 30,
                showInnerPercent: true,
                height: 16,
            },
        });
        expect(tallWrapper.find('.inner-value').text()).toBe('30%');
    });

    test('text 插槽代替外显百分比文案', () => {
        const wrapper = mount(FProgress, {
            props: {
                percent: 30,
                showOutPercent: true,
            },
            slots: {
                text: '<span class="custom-text">三十</span>',
            },
        });

        expect(wrapper.find('.out-value .custom-text').text()).toBe('三十');
        expect(wrapper.find('.out-value').text()).not.toContain('30%');
    });

    test('circle 类型渲染 svg 及默认线宽', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
            },
        });

        expect(wrapper.find('svg.circle-progress').exists()).toBe(true);
        // 默认 circleSize 160，svg 尺寸等于直径
        expect(wrapper.find('svg.circle-progress').attributes('width')).toBe(
            '160',
        );
        expect(wrapper.find('circle.progress').attributes('stroke-width')).toBe(
            '8',
        );
        expect(
            wrapper.find('circle.progress').attributes('stroke-dasharray'),
        ).toContain(' ');
    });

    test('circle 类型 width 自定义线宽', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
                width: 12,
                circleSize: 120,
            },
        });

        expect(wrapper.find('svg.circle-progress').attributes('width')).toBe(
            '120',
        );
        expect(wrapper.find('circle.progress').attributes('stroke-width')).toBe(
            '12',
        );
    });

    test('circle 类型 color 设置描边颜色', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
                color: '#ff6200',
            },
        });

        expect(
            wrapper.find('circle.progress').attributes('style'),
        ).toContain('stroke: rgb(255, 98, 0)');
    });

    test('circle 类型 showCircleText 展示百分比文本', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
                showCircleText: true,
            },
        });

        expect(wrapper.find('text.progress-text').text()).toBe('50%');
    });

    test('circle 类型默认不展示文本', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
            },
        });

        expect(wrapper.find('text.progress-text').exists()).toBe(false);
    });

    test('circle 类型 text 插槽渲染在 foreignObject 中', () => {
        const wrapper = mount(FProgress, {
            props: {
                type: PROGRESS_TYPE.CIRCLE,
                percent: 50,
                showCircleText: true,
            },
            slots: {
                text: '<b class="custom-circle-text">半程</b>',
            },
        });

        expect(wrapper.find('foreignObject').exists()).toBe(true);
        expect(wrapper.find('.slot-content .custom-circle-text').text()).toBe(
            '半程',
        );
        expect(wrapper.find('text.progress-text').exists()).toBe(false);
    });

    test('helper 函数输出正确的尺寸样式', () => {
        expect(getProgressDimension('width', 20)).toEqual({
            width: '20%',
        });
        expect(getLineProgressBarStyle('height', 8)).toEqual({
            height: '8px',
            borderRadius: '4px',
        });
    });
});
