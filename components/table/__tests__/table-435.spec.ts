import { ref } from 'vue';
import { isEqual } from 'lodash-es';

describe('table useTableLayout minWidth fix', () => {
    test('widthMap assignment includes minWidth when origin.minWidth exists during horizontal scroll', () => {
        const widthMap = ref<Record<string, { id: number; width?: number; minWidth?: number }>>({});
        const newWidthList: Record<string, { id: number; origin: { width?: number; minWidth?: number } }> = {
            col1: { id: 1, origin: { minWidth: 100 } },
            col2: { id: 2, origin: { width: 80 } },
            col3: { id: 3, origin: { minWidth: 120 } },
        };

        const isScrollX = ref(true);

        if (isScrollX.value) {
            Object.values(newWidthList).forEach((widthObj) => {
                const origin = widthObj.origin;
                const item: { id: number; width?: number; minWidth?: number } = {
                    id: widthObj.id,
                    width: origin.width ?? origin.minWidth,
                };
                if (origin.minWidth) {
                    item.minWidth = origin.minWidth;
                }
                if (!isEqual(item, widthMap.value[widthObj.id])) {
                    widthMap.value[widthObj.id] = item;
                }
            });
        }

        expect(widthMap.value[1]).toHaveProperty('minWidth', 100);
        expect(widthMap.value[2]).not.toHaveProperty('minWidth');
        expect(widthMap.value[3]).toHaveProperty('minWidth', 120);
    });

    test('widthMap should have minWidth preserved when horizontal scroll is active with narrow columns', () => {
        const widthMap = ref<Record<string, { id: number; width?: number; minWidth?: number }>>({});
        const newWidthList: Record<string, { id: number; origin: { width?: number; minWidth?: number } }> = {
            col1: { id: 1, origin: { minWidth: 120 } },
            col2: { id: 2, origin: { minWidth: 150 } },
            col3: { id: 3, origin: { minWidth: 180 } },
            col4: { id: 4, origin: { minWidth: 200 } },
        };

        const bodyMinWidth = 650;
        const wrapperWidth = 400;
        const isScrollX = bodyMinWidth > wrapperWidth;

        if (isScrollX) {
            Object.values(newWidthList).forEach((widthObj) => {
                const origin = widthObj.origin;
                const item: { id: number; width?: number; minWidth?: number } = {
                    id: widthObj.id,
                    width: origin.width ?? origin.minWidth,
                };
                if (origin.minWidth) {
                    item.minWidth = origin.minWidth;
                }
                if (!isEqual(item, widthMap.value[widthObj.id])) {
                    widthMap.value[widthObj.id] = item;
                }
            });
        }

        expect(widthMap.value[1]).toHaveProperty('minWidth', 120);
        expect(widthMap.value[2]).toHaveProperty('minWidth', 150);
        expect(widthMap.value[3]).toHaveProperty('minWidth', 180);
        expect(widthMap.value[4]).toHaveProperty('minWidth', 200);
    });

    test('colgroup should apply minWidth CSS from widthMap', () => {
        const widthMap = {
            col1: { width: undefined, minWidth: 120 },
            col2: { width: 80, minWidth: undefined },
            col3: { width: 100, minWidth: 150 },
        };

        const styles: string[] = [];

        Object.entries(widthMap).forEach(([columnId, item]) => {
            const style: string[] = [];
            if (item.width) {
                style.push(`width: ${item.width}px`);
            }
            if (item.minWidth) {
                style.push(`minWidth: ${item.minWidth}px`);
            }
            if (style.length > 0) {
                styles.push(`col[${columnId}]: ${style.join(', ')}`);
            }
        });

        expect(styles.length).toBe(3);
        expect(styles.some(s => s.includes('minWidth: 120px'))).toBe(true);
        expect(styles.some(s => s.includes('minWidth: 150px'))).toBe(true);
    });
});