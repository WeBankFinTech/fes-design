import { mount } from '@vue/test-utils';
import { FAside, FFooter, FHeader, FLayout, FMain } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import fs from 'fs';
import path from 'path';

const prefixCls = getPrefixCls('layout');

const _mount = (props, slots = {}) =>
    mount(FLayout, {
        attachTo: document.body,
        props,
        slots,
    });

describe('Layout Sider #887', () => {
    test('style file has box-sizing: border-box in aside block', () => {
        const stylePath = path.resolve(
            __dirname,
            '../style/index.less',
        );
        const styleContent = fs.readFileSync(stylePath, 'utf-8');
        const asideBlockMatch = styleContent.match(
            /\.@{aside-prefix-cls}\s*\{[^}]*box-sizing:\s*border-box[^}]*\}/s,
        );
        expect(asideBlockMatch).not.toBeNull();
        expect(asideBlockMatch[0]).toContain('box-sizing: border-box');
    });

    test('FSider rendered element has box-sizing: border-box', async () => {
        const wrapper = _mount(
            {},
            {
                default: () => [
                    'FAside',
                ],
            },
        );
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.exists()).toBe(true);
        const asideEl = aside.element;
        const computedStyle = window.getComputedStyle(asideEl);
        expect(computedStyle.boxSizing).toBe('border-box');
    });
});