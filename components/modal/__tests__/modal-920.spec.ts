import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import FModal from '../modal';
import fs from 'fs';
import path from 'path';

describe('modal-920: word-break fix', () => {
    it('less file should contain overflow hidden and word-break break-word', () => {
        const lessFilePath = path.resolve(__dirname, '../style/index.less');
        const lessContent = fs.readFileSync(lessFilePath, 'utf-8');

        expect(lessContent).toContain('overflow: hidden');
        expect(lessContent).toContain('word-break: break-word');

        expect(lessContent).toMatch(/\.@{modal-prefix-cls}-wrapper[\s\S]*?overflow:\s*hidden/);
        expect(lessContent).toMatch(/\.@{modal-prefix-cls}-body[\s\S]*?word-break:\s*break-word/);
    });

    it('FModal with long-no-space string should render without error and have word-break style', async () => {
        const longText = '这是一段非常长的没有任何空格的文字用于测试wordbreak是否生效这只股票代码是SH600000SH600000SH600000SH600000SH600000SH600000';

        const wrapper = mount(FModal, {
            attachTo: document.body,
            props: {
                show: true,
                title: '测试长文字',
            },
            slots: {
                default: () => longText,
            },
        });

        await nextTick();
        await new Promise(resolve => setTimeout(resolve, 500));

        const modalBodyEl = document.body.querySelector('.fes-modal-body');
        expect(modalBodyEl).not.toBeNull();
        expect(modalBodyEl?.textContent).toContain(longText);

        wrapper.unmount();
    });
});