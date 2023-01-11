import { mount, shallowMount } from '@vue/test-utils';
import FGrid from '../grid.vue';
import FGridItem from '../gridItem.vue';

import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('grid');

describe('FEllipsis', () => {
    ['flex-start', 'center', 'flex-end', 'baseline', 'stretch'].forEach(
        (align) => {
            test(`align ${align}`, async () => {
                const wrapper = shallowMount(FGrid, {
                    props: { align },
                    slots: {
                        default: () => (
                            <>
                                <FGridItem />
                                <FGridItem />
                            </>
                        ),
                    },
                });

                expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
                expect(
                    wrapper.find(`.${prefixCls}`).attributes('style'),
                ).toContain(`align-items: ${align};`);
            });
        },
    );

    [
        'flex-start',
        'flex-end',
        'center',
        'space-around',
        'space-between',
    ].forEach((justify) => {
        test(`justify ${justify}`, async () => {
            const wrapper = shallowMount(FGrid, {
                props: { justify },
                slots: {
                    default: () => (
                        <>
                            <FGridItem />
                            <FGridItem />
                        </>
                    ),
                },
            });

            expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
            expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
                `justify-content: ${justify};`,
            );
        });
    });

    test(`gutter`, async () => {
        const gutter = 20;
        const wrapper = mount(FGrid, {
            props: {
                gutter: gutter,
            },
            slots: {
                default: () => (
                    <>
                        <FGridItem class="item-0" />
                        <FGridItem class="item-1" />
                    </>
                ),
            },
        });

        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            `margin-left: -${gutter / 2}px; margin-right: -${gutter / 2}px`,
        );
        expect(wrapper.find(`.item-0`).attributes('style')).toContain(
            `padding-left: ${gutter / 2}px; padding-right: ${gutter / 2}px;`,
        );
        expect(wrapper.find(`.item-1`).attributes('style')).toContain(
            `padding-left: ${gutter / 2}px; padding-right: ${gutter / 2}px;`,
        );

        await wrapper.setProps({
            gutter: [gutter, gutter],
        });
        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            `row-gap: ${gutter}px;`,
        );
    });

    test(`item span`, async () => {
        const span = 6;
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem span={span} />,
            },
        });

        expect(wrapper.find(`.${prefixCls}-item-${span}`).exists()).toBe(true);
    });

    test(`item offset`, async () => {
        const offset = 6;
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem offset={offset} />,
            },
        });

        expect(
            wrapper.find(`.${prefixCls}-item-offset-${offset}`).exists(),
        ).toBe(true);
    });

    test(`item order`, async () => {
        const order = 1;
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem order={order} />,
            },
        });

        expect(
            wrapper.find(`.${prefixCls}-item`).attributes('style'),
        ).toContain(`order: ${order};`);
    });

    test(`item pull`, async () => {
        const pull = 1;
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem pull={pull} />,
            },
        });

        expect(wrapper.find(`.${prefixCls}-item-pull-${pull}`).exists()).toBe(
            true,
        );
    });

    test(`item push`, async () => {
        const push = 1;
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem push={push} />,
            },
        });

        expect(wrapper.find(`.${prefixCls}-item-push-${push}`).exists()).toBe(
            true,
        );
    });

    test(`item flex`, async () => {
        const flex = '0 0 100px';
        const wrapper = mount(FGrid, {
            slots: {
                default: () => <FGridItem flex={flex} />,
            },
        });

        expect(
            wrapper.find(`.${prefixCls}-item`).attributes('style'),
        ).toContain(`flex: ${flex};`);
    });
});
