import { mount } from '@vue/test-utils';
import { nextTick, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import FTabs, { FTabPane } from '../index';

const prefixCls = 'fes-tabs';

describe('tabs-820 v-show regression', () => {
    it('helper.ts imports vShow from vue (regression test)', () => {
        const helperPath = resolve(__dirname, '../helper.ts');
        const helperSource = readFileSync(helperPath, 'utf-8');
        expect(helperSource).toContain('vShow');
        expect(helperSource).toMatch(/import\s*\{[^}]*vShow[^}]*\}\s*from\s*['"]vue['"]/);
    });

    it('all pane DOM elements are kept in DOM when switching tabs with displayDirective=show', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 'tab1' },
            slots: {
                default: () => [
                    h(FTabPane, { name: 'Tab 1', value: 'tab1', displayDirective: 'show' }, {
                        default: () => h('div', { class: 'pane-content' }, 'Content 1')
                    }),
                    h(FTabPane, { name: 'Tab 2', value: 'tab2', displayDirective: 'show' }, {
                        default: () => h('div', { class: 'pane-content' }, 'Content 2')
                    }),
                    h(FTabPane, { name: 'Tab 3', value: 'tab3', displayDirective: 'show' }, {
                        default: () => h('div', { class: 'pane-content' }, 'Content 3')
                    }),
                ],
            },
        });
        await nextTick();

        const allPanes = wrapper.findAll(`.${prefixCls}-tab-pane`);
        expect(allPanes.length).toBe(3);

        await wrapper.findAll(`.${prefixCls}-tab`)[1].trigger('click');
        await nextTick();

        const allPanesAfter = wrapper.findAll(`.${prefixCls}-tab-pane`);
        expect(allPanesAfter.length).toBe(3);

        await wrapper.findAll(`.${prefixCls}-tab`)[2].trigger('click');
        await nextTick();

        const allPanesFinal = wrapper.findAll(`.${prefixCls}-tab-pane`);
        expect(allPanesFinal.length).toBe(3);
    });
});