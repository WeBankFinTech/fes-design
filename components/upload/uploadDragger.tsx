import {
    h,
    inject,
    defineComponent,
    ExtractPropTypes,
    ref,
    computed,
} from 'vue';
import { useTheme } from '../_theme/useTheme';
import { key } from './const';
import { matchType } from './utils';
import FMessage from '../message';

const uploadDraggerProps = {} as const;

export type UploadDraggerProps = Partial<
    ExtractPropTypes<typeof uploadDraggerProps>
>;

export default defineComponent({
    name: 'FUploadDragger',
    props: uploadDraggerProps,
    emits: [],
    setup(props, ctx) {
        useTheme();

        const {
            prefixCls,
            onUploadFiles,
            isDragger,
            accept,
            multiple,
            disabled,
        } = inject(key);

        isDragger.value = true;

        const isHovering = ref(false);

        const classList = computed(() => {
            return [
                `${prefixCls}-dragger`,
                isHovering.value && 'is-hovering',
            ].filter(Boolean);
        });

        const handleEnter = (event: DragEvent) => {
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = true;
        };

        const handleLeave = (event: DragEvent) => {
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = false;
        };

        const handleOver = (event: DragEvent) => {
            // 阻止事件的默认行为
            event.preventDefault();
        };

        const handleDrop = (event: DragEvent) => {
            // 阻止事件的默认行为
            event.preventDefault();
            if (disabled.value) return;
            isHovering.value = false;
            let postFiles = Array.from(event.dataTransfer.files);
            if (!postFiles.length) return;
            if (!multiple.value) {
                postFiles = postFiles.slice(0, 1);
            }
            const filterFiles = postFiles.filter((file) => {
                return matchType(file.name, file.type, accept.value);
            });
            if (filterFiles.length !== postFiles.length) {
                FMessage.error("上传文件格式不正确！")
            }
            onUploadFiles(filterFiles);
        };

        return () => {
            return (
                <div
                    class={classList.value}
                    onDragenter={handleEnter}
                    onDragleave={handleLeave}
                    onDrop={handleDrop}
                    onDragover={handleOver}
                >
                    {ctx.slots?.default?.()}
                </div>
            );
        };
    },
});
