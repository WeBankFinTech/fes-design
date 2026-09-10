import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Preview from '../preview.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const previewPrefixCls = getPrefixCls('preview');
const IMAGE_SUCCESS
    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAoCAYAAABTsMJyAAABQGlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSCwoyGFhYGDIzSspCnJ3UoiIjFJgf8rAzsDKwM/AxWCUmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsisJ8GJedFizm//KextP6bsJI+pHgVwpaQWJwPpP0CclFxQVMLAwJgAZCuXlxSA2C1AtkgR0FFA9gwQOx3CXgNiJ0HYB8BqQoKcgewrQLZAckZiCpD9BMjWSUIST0diQ+0FAY4QI+MUXUMDAk4lHZSkVpSAaOf8gsqizPSMEgVHYAilKnjmJevpKBgZGBkyMIDCG6L68w1wODKKcSDEUioYGIyFgIKOCLGsbAaGPZ4MDIJOCDH1z0AvLWVgOLCyILEoEe4Axm8sxWnGRhA293YGBtZp//9/DmdgYNdkYPh7/f//39v///+7jIGB+RZQ7zcA0ildchJzgLcAAABWZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAOShgAHAAAAEgAAAESgAgAEAAAAAQAAADOgAwAEAAAAAQAAACgAAAAAQVNDSUkAAABTY3JlZW5zaG90IAAvnAAAAdRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+NDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NTE8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpVc2VyQ29tbWVudD5TY3JlZW5zaG90PC9leGlmOlVzZXJDb21tZW50PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K1RT9WQAABSRJREFUaAXtWdFi4zAIW/r/37wekhDguO22No+XBxuDEMJ20+7uuMfz9eCB85j+cNzDYR+yjlwIOzJscr5/3SPLeaI0YBZY7Q0Rjp/q30yBkvM5zj2ORog7Gi+hQ65jnEcjToEqPnaE0Avq38wxSsqV2z4PrkvjhCzoLAvriBHcmGWZbpzYlfVvqybJnRIO36Wo2n41YCEpf3Fq84NPlGtunjr5FtLP6vOa9e6DGYSpoHYO62OJQHkJxoKPcDClMcaiNCeCijIlhqvqx0cjtokaWrCvfCpyzZezpVLmstjTtjBLc2gpSFt73omGB9k3EjNJmdx/mFwiSsR5KhpFdQWXTRCdcAGaH3DUUDi9XMjzWf37d5TSFcqXTwm1AcFTm/2/nZd8LPAUoaIcF6BgGJ+4G5BWfGZyR15k1Gs6MID95WnacQrVCJiuq398x2dm4bZSfit2Mbs9t0h7xjw7fkwe4AgEDsUfQyLIwMPow9O66YKlkEUESJZorBPgOhOfFJxwXyPdu7TBHAjMUmEC+cZboj/WjxdAdg4imJMwXTHlI6y0BDBTHfVsTofPkr7qTYFyibqgfpzMojMEuhvMwx6mcs4SG1Cc5rbgYgwE4dVKb8wH9fPnjIWguqVgbts3o1yMOg9zY2PBp78M+8VMVMDFFytSmAdpk6ft39Tnl+aUQnJXLGKJezY6n+8M6AvH8iVvwBOCJVyLMp5ktdtI/pxx/wjX52E0AnBuoZRy3YPz3YBnISI7AeSJQXx7Pjyf1K8/AVxYdWOsir7XityHUpwAHk6Fl69H5ClIhhjE1Ii2Rq3iGz4wvaiv32bNxrIuBj7bA5Kmoq8xnXVGc/0gebqm3Uy2FJ2YOhk48Uzxsv3hNSJANBH1riFzPgObbnEpBy6+C+UkwhnDlVp+Xz+aEU2RmDX9KKtYIarjtRUXldRKt9Tk7d8b5ruufjSzknpZPYWqtqmshvpKoMdNj4NLJJuOMuA5Mqk5r6vPa6YPMg5+lNhe7IpxNIw6YrG8CXp7KD/Clqt5jur2qvpsxi+I3tvc0pwsBkvasbvdVHiaIBBjS7AhTHD3DHuIWU+nE2x3zdNL+0l9NqMsFayykVU2jUnppiKTMSEx4koVsu5h//TRgReiBLuamML9Rn1dM1Iqe5apv2NeETOhcyufqmqVP/n8ykjJy9Qc7vCv9XXNkI2L27XFF+ef9cy/Y5CKKHMH+sTFEzl/DvPklPp5/e1Lk6qhaYo5rwnCsAd2T4HbCNA9GhkXsmOwziTndaHXwPjMiAThasRvqdlYEQHfAeaFivYgnmDOGPrlgEYcThTx9Jnkj/V1MmAwwajfrgEYZol41zCX58GzusZqmANOUyfTqjN+2mF0ChI8Zyz9Dka8zDLK1Z6EmcszC2B4r340E0c/qshc2ekL14CVvb1qK9VGC5sXy9Er60czcXvJnG1wWmU7LAGJy11sUbWtJ2MiRjtBY6ar6o8XQBblNIqOe+XiULufpqLsxCbn/tAjpioRCCMrMqVWH9SvZtaSQT3VpoqleH27W8aIOsZ5vICrSWPt4GXLpjS9U////8/UFvbGjisjp14MYSfGZ8HcPHX61gDD7YqXh3+FBlH7U8GpPq9Z/5MQ4EAYFWuaGPQ5cgR0JRgLPsLBVOEYi3JklsDMqitdYAWQzDTxYhwsW/3xpdkJvvKpKIlfTy4COVWRiz1vwRqfny+q2AA7x9mDlP//P3PelZ/W3G2Dtl1XlOMCdIIO+skhNyisf6kSnAQKMKCqAAAAAElFTkSuQmCC';

describe('FAlert', () => {
    // Preview 默认 teleport 到 document.body，每个用例后清理避免污染
    afterEach(() => {
        document.body.innerHTML = '';
    });

    // ---------------- image preview -------------------
    test('image preview', async () => {
        mount(Preview, {
            props: {
                src: IMAGE_SUCCESS,
                size: { width: 51, height: 40 },
            },
        });
        await nextTick();
        const root = document.body;
        expect(root.querySelector(`.${previewPrefixCls}__close`)).not.toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}__arrow-left`)).toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}__arrow-right`)).toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}-zoom-out`)).not.toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}-zoom-in`)).not.toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}-rotate-left`)).not.toBeNull();
        expect(root.querySelector(`.${previewPrefixCls}-rotate-right`)).not.toBeNull();
    });

    // ---------------- image hide-on-click-modal -------------------
    test('image hide-on-click-modal', async () => {
        const wrapper = mount(Preview, {
            props: {
                src: IMAGE_SUCCESS,
                size: { width: 51, height: 40 },
            },
        });
        await nextTick();
        const previewEl = document.body.querySelector(
            `.${previewPrefixCls}`,
        ) as HTMLElement;
        // hideOnClickModal 默认 false，点击遮罩不关闭
        previewEl.click();
        expect(wrapper.emitted('close')).toBeUndefined();

        await wrapper.setProps({
            hideOnClickModal: true,
        });

        previewEl.click();
        expect(wrapper.emitted('close')).toBeDefined();
    });
});
