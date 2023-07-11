import { inject, defineComponent, ref, computed, PropType } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { useLocale } from '../config-provider/useLocale';
import FMessage from '../message';
import { key } from './const';
import { matchType } from './utils';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const uploadDraggerProps = {
    onFileTypeInvalid: {
        type: Function as PropType<(files: File[]) => void>,
    },
} as const;

export type UploadDraggerProps = ExtractPublicPropTypes<
    typeof uploadDraggerProps
>;

export default defineComponent({
    name: 'FUploadDragger',
    props: uploadDraggerProps,
    emits: [],
    setup(props, ctx) {
        useTheme();

        const { t } = useLocale();

        const {
            prefixCls,
            onUploadFiles,
            isDragger,
            accept,
            multiple,
            disabled, // 组件本身的disabled 状态
        } = inject(key);

        isDragger.value = true;

        const isHovering = ref(false);

        const classList = computed(() => {
            return [
                `${prefixCls}-dragger`,
                isHovering.value && 'is-hovering',
                disabled.value && 'is-disabled',
            ].filter(Boolean);
        });

        const handleEnter = (event: DragEvent) => {
            if (disabled.value) return;
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = true;
        };

        const handleLeave = (event: DragEvent) => {
            if (disabled.value) return;
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = false;
        };

        const handleOver = (event: DragEvent) => {
            if (disabled.value) return;
            // 阻止事件的默认行为
            event.preventDefault();
        };

        const handleDrop = (event: DragEvent) => {
            if (disabled.value) return;
            // 阻止事件的默认行为
            event.preventDefault();
            isHovering.value = false;
            let postFiles = Array.from(event.dataTransfer.files);
            if (!postFiles.length) return;
            if (!multiple.value) {
                postFiles = postFiles.slice(0, 1);
            }
            const filterFiles = accept.value.length
                ? postFiles.filter((file) => {
                      return matchType(file.name, file.type, accept.value);
                  })
                : postFiles;
            if (filterFiles.length !== postFiles.length) {
                if (props.onFileTypeInvalid) {
                    props.onFileTypeInvalid(
                        postFiles.filter((file) => {
                            return !matchType(
                                file.name,
                                file.type,
                                accept.value,
                            );
                        }),
                    );
                } else {
                    FMessage.error(t('upload.fileTypeInvalidTip'));
                }
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
