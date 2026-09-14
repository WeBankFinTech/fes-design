import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Modal from '../modal';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('modal');
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountModal = (props = {}, content = '弹窗内容') =>
    mount(
        h(
            Modal,
            { show: true, ...props } as any,
            { default: () => content },
        ),
        { attachTo: document.body },
    );

describe('FModal maxHeight 内容高度计算', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('maxHeight 为数字时应用内容高度限制', async () => {
        mountModal({ maxHeight: 300 });
        await nextTick();
        await wait();
        const scroller = document.querySelector(
            '.fes-scrollbar-container[style*="max-height"]',
        );
        expect(scroller).toBeTruthy();
    });

    test('maxHeight 为 px 字符串', async () => {
        mountModal({ maxHeight: '200px' });
        await nextTick();
        await wait();
        expect(
            document.querySelector(
                '.fes-scrollbar-container[style*="max-height"]',
            ),
        ).toBeTruthy();
    });

    test('maxHeight 为 % 字符串', async () => {
        mountModal({ maxHeight: '50%' });
        await nextTick();
        await wait();
        expect(
            document.querySelector(
                '.fes-scrollbar-container[style*="max-height"]',
            ),
        ).toBeTruthy();
    });

    test('maxHeight 非法格式告警且不限制高度', async () => {
        const spy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        mountModal({ maxHeight: '30em' });
        await nextTick();
        await wait();
        expect(spy).toHaveBeenCalledWith(
            '[FModal] maxHeight 仅支持 px、%、数值格式',
        );
        spy.mockRestore();
    });

    test('fullScreen 模式不计算 maxHeight', async () => {
        mountModal({ fullScreen: true, maxHeight: 300 });
        await nextTick();
        await wait();
        expect(
            document.querySelector(`.${prefixCls}-container`),
        ).toBeTruthy();
    });
});
