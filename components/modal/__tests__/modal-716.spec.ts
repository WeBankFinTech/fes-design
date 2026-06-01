import { mount } from '@vue/test-utils';
import { nextTick, watch } from 'vue';
import { readFileSync } from 'fs';
import { join } from 'path';
import FModal from '../modal';

const prefixCls = 'fes-modal';

describe('FModal useContentMaxHeight regression test #716', () => {
    test('useContentMaxHeight contains modalRef.offsetHeight watch for first show recalculation', () => {
        const filePath = join(__dirname, '../useContentMaxHeight.ts');
        const content = readFileSync(filePath, 'utf-8');
        expect(content).toContain('modalRef.value?.offsetHeight');
        expect(content).toMatch(/watch\s*\(\s*\(\)\s*=>\s*modalRef\.value\?\.offsetHeight/);
    });

    test('FModal with displayDirective=show calculates contentMaxHeight on first show', async () => {
        const wrapper = mount(FModal, {
            attachTo: document.body,
            props: {
                displayDirective: 'show',
                show: false,
                title: 'Test Title',
                maxHeight: 400,
            },
            slots: {
                default: 'Test Content',
            },
        });

        expect(wrapper.props('show')).toBe(false);

        await wrapper.setProps({ show: true });
        await nextTick();

        expect(wrapper.props('show')).toBe(true);

        const bodyEl = document.body.querySelector(`.${prefixCls}-body`);
        expect(bodyEl).toBeTruthy();
        expect(bodyEl.textContent).toBe('Test Content');
    });

    test('FModal with displayDirective=show renders correctly after show', async () => {
        const wrapper = mount(FModal, {
            attachTo: document.body,
            props: {
                displayDirective: 'show',
                show: false,
                title: 'Title',
            },
            slots: {
                default: 'Content',
                footer: 'Footer',
            },
        });

        await wrapper.setProps({ show: true });
        await nextTick();

        const containerEl = document.body.querySelector(`.${prefixCls}-container`);
        expect(containerEl).toBeTruthy();
    });
});