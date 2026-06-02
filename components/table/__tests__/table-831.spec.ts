import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import FTable from '../table';
import FTableColumn from '../column';

describe('FTable column minWidth/maxWidth support', () => {
    const defaultData = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
    ];

    it('should apply minWidth as number to column', () => {
        const wrapper = mount(FTable, {
            props: {
                data: defaultData,
            },
            slots: {
                default: () => [
                    h(FTableColumn, {
                        prop: 'name',
                        label: 'Name',
                        minWidth: 120,
                    }),
                    h(FTableColumn, {
                        prop: 'age',
                        label: 'Age',
                    }),
                ],
            },
        });

        const th = wrapper.findAll('th')[0];
        expect(th.attributes('style')).toContain('min-width');
    });

    it('should apply maxWidth as number to column', () => {
        const wrapper = mount(FTable, {
            props: {
                data: defaultData,
            },
            slots: {
                default: () => [
                    h(FTableColumn, {
                        prop: 'name',
                        label: 'Name',
                        maxWidth: 100,
                    }),
                    h(FTableColumn, {
                        prop: 'age',
                        label: 'Age',
                    }),
                ],
            },
        });

        const th = wrapper.findAll('th')[0];
        expect(th.attributes('style')).toContain('max-width');
    });

    it('should apply minWidth as string to column', () => {
        const wrapper = mount(FTable, {
            props: {
                data: defaultData,
            },
            slots: {
                default: () => [
                    h(FTableColumn, {
                        prop: 'name',
                        label: 'Name',
                        minWidth: '150px',
                    }),
                    h(FTableColumn, {
                        prop: 'age',
                        label: 'Age',
                    }),
                ],
            },
        });

        const th = wrapper.findAll('th')[0];
        const style = th.attributes('style');
        expect(style).toContain('min-width: 150px');
    });

    it('should apply maxWidth as string to column', () => {
        const wrapper = mount(FTable, {
            props: {
                data: defaultData,
            },
            slots: {
                default: () => [
                    h(FTableColumn, {
                        prop: 'name',
                        label: 'Name',
                        maxWidth: '80px',
                    }),
                    h(FTableColumn, {
                        prop: 'age',
                        label: 'Age',
                    }),
                ],
            },
        });

        const th = wrapper.findAll('th')[0];
        const style = th.attributes('style');
        expect(style).toContain('max-width: 80px');
    });

    it('should apply both minWidth and maxWidth to column', () => {
        const wrapper = mount(FTable, {
            props: {
                data: defaultData,
            },
            slots: {
                default: () => [
                    h(FTableColumn, {
                        prop: 'name',
                        label: 'Name',
                        minWidth: 80,
                        maxWidth: 200,
                    }),
                    h(FTableColumn, {
                        prop: 'age',
                        label: 'Age',
                    }),
                ],
            },
        });

        const th = wrapper.findAll('th')[0];
        const style = th.attributes('style');
        expect(style).toContain('min-width: 80px');
        expect(style).toContain('max-width: 200px');
    });
});