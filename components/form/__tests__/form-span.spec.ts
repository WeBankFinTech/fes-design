import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const FORM_PATH = path.resolve(__dirname, '../style/index.less');

describe('form span grid-column fix', () => {
    it('LESS file includes grid-column: span @value pattern (fixed), not broken span @{value} / span @{value} pattern', () => {
        const content = fs.readFileSync(FORM_PATH, 'utf-8');
        expect(content).toContain('grid-column: span @value');
        expect(content).not.toContain('span @{value} / span @{value}');
    });

    it('FForm inline layout generates f-form-item-span-N classes via each loop', () => {
        const content = fs.readFileSync(FORM_PATH, 'utf-8');
        const hasEachLoop = content.includes('each(range(24),') || content.includes('each(range(24), {');
        expect(hasEachLoop).toBe(true);
        expect(content).toContain('.@{form-item-cls}-span-@{value}');
        expect(content).toContain('grid-column: span @value');
    });
});