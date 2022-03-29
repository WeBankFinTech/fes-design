import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { FLayout, FHeader, FMain, FAside, FFooter } from '../index';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('layout');

const _mount = (props, slots = {}) =>
    mount(FLayout, {
        attachTo: document.body,
        props,
        slots,
    });

describe('Layout', () => {
    test('default flex direction is row', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FMain>FMain</FMain>
                    </>
                ),
            },
        );
        expect(wrapper.classes()).toStrictEqual([prefixCls, 'is-root']);
        await nextTick();
        expect(wrapper.classes()).toStrictEqual([prefixCls, 'is-root']);
    });

    test('aside width', async () => {
        const width = '300px';
        const wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FAside width={width}>FAside</FAside>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                    </>
                ),
            },
        );
        expect(
            wrapper.find(`.${prefixCls}-aside`).attributes('style'),
        ).toContain(`width: ${width};`);
    });

    test('aside fixed', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FAside fixed>FAside</FAside>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                    </>
                ),
            },
        );
        expect(wrapper.find(`.${prefixCls}-aside`).classes()).toContain(
            'is-fixed',
        );
    });

    test('aside placement', async () => {
        let wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FAside>FAside</FAside>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                    </>
                ),
            },
        );
        expect(wrapper.find(`.${prefixCls}-aside`).classes()).toContain(
            'is-placement-left',
        );
        wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                        <FAside>FAside</FAside>
                    </>
                ),
            },
        );
        expect(wrapper.find(`.${prefixCls}-aside`).classes()).toContain(
            'is-placement-right',
        );
    });

    test('aside trigger', async () => {
        let wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FAside collapsible collapsed={false}>
                            FAside
                        </FAside>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                    </>
                ),
            },
        );
        let trigger = wrapper.find(`.${prefixCls}-aside-trigger`);
        expect(trigger.exists()).toBe(true);
        wrapper = _mount(
            {},
            {
                default: () => (
                    <>
                        <FAside
                            showTrigger={false}
                            collapsible
                            collapsed={false}
                        >
                            FAside
                        </FAside>
                        <FLayout>
                            <FHeader>FHeader</FHeader>
                            <FMain>FMain</FMain>
                            <FFooter>FFooter</FFooter>
                        </FLayout>
                    </>
                ),
            },
        );
        trigger = wrapper.find(`.${prefixCls}-aside-trigger`);
        expect(trigger.exists()).toBe(false);
    });
});
