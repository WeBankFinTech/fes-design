import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FSpace from '../index';
import '../space';

describe('Space Grid Layout #885', () => {
    it('space.tsx uses grid display (not flex)', async () => {
        const fsSpace = mount(FSpace, {
            slots: {
                default: [
                    { template: '<span>1</span>' },
                    { template: '<span>2</span>' },
                    { template: '<span>3</span>' },
                ],
            },
        });
        const el = fsSpace.element as HTMLElement;
        expect(el.style.display).toBe('grid');
    });

    it('space.tsx sets gridTemplateColumns with repeat(auto-fit or auto-fill)', async () => {
        const fsSpace = mount(FSpace, {
            slots: {
                default: [
                    { template: '<span>1</span>' },
                    { template: '<span>2</span>' },
                    { template: '<span>3</span>' },
                ],
            },
        });
        const el = fsSpace.element as HTMLElement;
        expect(el.style.gridTemplateColumns).toMatch(/repeat\((auto-fit|auto-fill)/);
    });

    it('FSpace with 3 children renders with display grid', async () => {
        const wrapper = mount(FSpace, {
            props: { size: 8 },
            slots: {
                default: [
                    { template: '<button>Btn1</button>' },
                    { template: '<button>Btn2</button>' },
                    { template: '<button>Btn3</button>' },
                ],
            },
        });
        const el = wrapper.element as HTMLElement;
        expect(el.style.display).toBe('grid');
        expect(wrapper.findAll('.fes-space > *')).toHaveLength(3);
    });
});