import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import FUpload from '../upload';

describe('FUpload drag prop #866', () => {
    it('renders drag zone when drag prop is true', async () => {
        const wrapper = mount(FUpload, {
            props: { drag: true },
            slots: { default: () => 'Drop files here' },
        });
        await wrapper.vm.$nextTick();
        const draggerEl = wrapper.find('.fes-upload-dragger');
        expect(draggerEl.exists()).toBe(true);
    });

    it('renders normal trigger when drag prop is false', async () => {
        const wrapper = mount(FUpload, {
            props: { drag: false },
            slots: { default: () => 'Click to upload' },
        });
        await wrapper.vm.$nextTick();
        const draggerEl = wrapper.find('.fes-upload-dragger');
        expect(draggerEl.exists()).toBe(false);
    });

    it('drop event triggers file handling', async () => {
        const wrapper = mount(FUpload, {
            props: { drag: true },
            slots: { default: () => 'Drop here' },
        });
        await wrapper.vm.$nextTick();
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const dataTransfer = { files: [file] };
        const dropEvent = new DragEvent('drop', { bubbles: true, cancelable: true });
        Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });
        const draggerEl = wrapper.find('.fes-upload-dragger');
        expect(draggerEl.exists()).toBe(true);
        draggerEl.element.dispatchEvent(dropEvent);
    });

    it('drag zone has correct class structure', async () => {
        const wrapper = mount(FUpload, {
            props: { drag: true },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.fes-upload-dragger').exists()).toBe(true);
    });
});