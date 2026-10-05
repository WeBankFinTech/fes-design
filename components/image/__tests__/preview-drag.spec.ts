import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Preview from '../preview.vue';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const previewPrefixCls = getPrefixCls('preview');

const IMAGE_SRC
    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAoCAYAAABTsMJyAAABQGlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSCwoyGFhYGDIzSspCn3UoiIjFJgf8rAzsDKwM/AxWCUmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsisJ8GJedFizm//KextP6bsJI+pHgVwpaQWJwPpP0CclFxQVMLAwJgAZCuXlxSA2C1AtkgR0FFA9gwQOx3CXgNiJ0HYB8BqQoKcgewrQLZAckZiCpD9BMjWSUIST0diQ+0FAY4QI+MUXUMDAk4lHZSkVpSAaOf8gsqizPSMEgVHYAilKnjmJevpKBgZGBkyMIDCG6L68w1wODKKcSDEUioYGIyFgIKOCLGsbAaGPZ4MDIJOCDH1z0AvLWVgOLCyILEoEe4Axm8sxWnGRhA293YGBtZp//9/DmdgYNdkYPh7/f//39v///+7jIGB+RZQ7zcA0ildchJzgLcAAABWZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAOShgAHAAAAEgAAAESgAgAEAAAAAQAAADOgAwAEAAAAAQAAACgAAAAAQVNDSUkAAABTY3JlZW5zaG90IAAvnAAAAdRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJDb3JlIDYuMC4wIj4KICAgICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICAgICA8eG1wOkNvb2tpZVRpbWU+MTYyMzg1MTIyNjwveG1wOkNvb2tpZVRpbWU+CiAgICAgICAgICAgIDx4bXA6UGl4ZWxZRGltZW5zaW9uPjQwPC94bXA6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICAgICA8eG1wOlBpeGVsWERpbWVuc2lvbj41MTwveG1wOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDwvcmRmOlJERj4KICAgPC94OnhtcG1ldGE+CiAgIDx3OnJkZjpSREYgeG1sbnM6PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJDb3JlIDYuMC4wIj4KICAgICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICAgICA8eG1wOkNvb2tpZVRpbWU+MTYyMzg1MTIyNjwveG1wOkNvb2tpZVRpbWU+CiAgICAgICAgICAgIDx4bXA6UGl4ZWxZRGltZW5zaW9uPjQwPC94bXA6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICAgICA8eG1wOlBpeGVsWERpbWVuc2lvbj41MTwveG1wOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDwvcmRmOlJERj4KICAgPC94OnhtcG1ldGE+CiAgIDx3OnJkZjpSREYgeG1sbnM6PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJDb3JlIDYuMC4wIj4KICAgICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICAgICA8eG1wOkNvb2tpZVRpbWU+MTYyMzg1MTIyNjwveG1wOkNvb2tpZVRpbWU+CiAgICAgICAgICAgIDx4bXA6UGl4ZWxZRGltZW5zaW9uPjQwPC94bXA6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICAgICA8eG1wOlBpeGVsWERpbWVuc2lvbj41MTwveG1wOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDwvcmRmOlJERj4KICAgPC94OnhtcG1ldGE+CiAgIDx3OnJkZjpSREYgeG1sbnM6PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJDb3JlIDYuMC4wIj4KICAgICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICAgICA8eG1wOkNvb2tpZVRpbWU+MTYyMzg1MTIyNjwveG1wOkNvb2tpZVRpbWU+CiAgICAgICAgICAgIDx4bXA6UGl4ZWxZRGltZW5zaW9uPjQwPC94bXA6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICAgICA8eG1wOlBpeGVsWERpbWVuc2lvbj41MTwveG1wOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDwvcmRmOlJERj4KICAgPC94OnhtcG1ldGE+CiAgIDx3OnJkZjpSREYgeG1sbnM6PSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJDb3JlIDYuMC4wIj4KICAgICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbDwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICAgICA8eG1wOkNvb2tpZVRpbWU+MTYyMzg1MTIyNjwveG1wOkNvb2tpZVRpbWU+CiAgICAgICAgICAgIDx4bXA6UGl4ZWxZRGltZW5zaW9uPjQwPC94bXA6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICAgICA8eG1wOlBpeGVsWERpbWVuc2lvbj41MTwveG1wOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDwvcmRmOlJERj4KICAgPC94OnhtcG1ldGE+CiAgPC9kZXNjPgogIDwvc3ZnPgo=';

// Preview 直接挂载即渲染（teleport 到 body），无需经过 image.vue
const mountPreview = (props = {}) =>
    mount(Preview, {
        props: {
            src: IMAGE_SRC,
            size: { width: 51, height: 40 },
            ...props,
        },
        attachTo: document.body,
    });

describe('FImage 预览拖拽（usePreviewImageDrag）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('mousedown 触发拖拽态（is-dragging 类）', async () => {
        mountPreview();
        await nextTick();
        const canvas = document.querySelector(
            `.${previewPrefixCls}__canvas`,
        ) as HTMLElement;
        expect(canvas).not.toBeNull();
        canvas.dispatchEvent(
            new MouseEvent('mousedown', { bubbles: true }),
        );
        await nextTick();
        expect(
            canvas.className.includes('is-dragging')
            || document.querySelector('.is-dragging') !== null,
        ).toBe(true);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
    });

    test('mousedown 后 mousemove 更新偏移，mouseup 结束拖拽', async () => {
        mountPreview();
        await nextTick();
        const canvas = document.querySelector(
            `.${previewPrefixCls}__canvas`,
        ) as HTMLElement;
        canvas.dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                pageX: 100,
                pageY: 100,
            }),
        );
        document.dispatchEvent(
            new MouseEvent('mousemove', { pageX: 160, pageY: 140 }),
        );
        await wait();
        // 移动后 transform 偏移体现在 canvas 的 style 上
        const style = canvas.getAttribute('style') || '';
        expect(style.length).toBeGreaterThan(0);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
        // 拖拽结束
        expect(document.querySelector('.is-dragging')).toBeNull();
    });

    test('未按下时 mousemove 不产生拖拽态', async () => {
        mountPreview();
        await nextTick();
        document.dispatchEvent(
            new MouseEvent('mousemove', { pageX: 999, pageY: 999 }),
        );
        await wait();
        expect(document.querySelector('.is-dragging')).toBeNull();
    });

    test('mousedown preventDefault 阻止图片原生拖拽', async () => {
        mountPreview();
        await nextTick();
        const canvas = document.querySelector(
            `.${previewPrefixCls}__canvas`,
        ) as HTMLElement;
        const event = new MouseEvent('mousedown', { bubbles: true });
        const spy = vi.spyOn(event, 'preventDefault');
        canvas.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
    });
});
