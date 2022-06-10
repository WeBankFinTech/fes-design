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

        const { prefixCls, onUploadFiles, isDragger } = inject(key);

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
        }

        const handleDrop = (event: DragEvent) => {
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = false;
            onUploadFiles(event.dataTransfer.files)
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
